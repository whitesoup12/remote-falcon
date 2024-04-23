package com.remotefalcon.controlpanel.service;

import com.remotefalcon.library.documents.Show;
import com.remotefalcon.library.models.*;
import com.remotefalcon.library.enums.ShowRole;
import com.remotefalcon.library.enums.StatusResponse;
import com.remotefalcon.library.enums.ViewerControlMode;
import com.remotefalcon.controlpanel.repository.mongo.ShowRepository;
import com.remotefalcon.controlpanel.util.AuthUtil;
import com.remotefalcon.controlpanel.util.ClientUtil;
import com.remotefalcon.controlpanel.util.EmailUtil;
import com.remotefalcon.controlpanel.util.RandomUtil;
import com.sendgrid.Response;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GraphQLMutationService {
    private final EmailUtil emailUtil;
    private final AuthUtil authUtil;
    private final ClientUtil clientUtil;
    private final ShowRepository showRepository;
    private final HttpServletRequest httpServletRequest;

    public Boolean signUp(String firstName, String lastName, String showName) {
        String showSubdomain = showName.replaceAll("\\s", "").toLowerCase();
        String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
        if (basicAuthCredentials != null) {
            String email = basicAuthCredentials[0];
            String password = basicAuthCredentials[1];
            Optional<Show> show = this.showRepository.findByEmailOrShowSubdomain(email, showSubdomain);
            if (show.isPresent()) {
                throw new RuntimeException(StatusResponse.SHOW_EXISTS.name());
            }
            String showToken = this.validateShowToken(RandomUtil.generateToken(25));
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode(password);

            Show newShow = this.createDefaultShowDocument(firstName, lastName, showName, email,
                    hashedPassword, showToken, showSubdomain);

            Response emailResponse = this.emailUtil.sendSignUpEmail(newShow);
            if(emailResponse.getStatusCode() != 202) {
                throw new RuntimeException(StatusResponse.EMAIL_CANNOT_BE_SENT.name());
            }

            this.showRepository.save(newShow);
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    private Show createDefaultShowDocument(String firstName, String lastName, String showName,
                                           String email, String password, String showToken,
                                           String showSubdomain) {
        return Show.builder()
                .showToken(showToken)
                .email(email)
                .password(password)
                .showName(showName)
                .showSubdomain(showSubdomain)
                .userProfile(UserProfile.builder()
                        .firstName(firstName)
                        .lastName(lastName)
                        .facebookUrl(null)
                        .youtubeUrl(null)
                        .build())
                .emailVerified(false)
                .createdDate(LocalDateTime.now())
                .expireDate(LocalDateTime.now().plusDays(90))
                .showRole(ShowRole.USER)
                .preferences(Preference.builder()
                        .viewerControlEnabled(false)
                        .viewerControlMode(ViewerControlMode.JUKEBOX)
                        .resetVotes(false)
                        .jukeboxDepth(0)
                        .showLatitude(0.0F)
                        .showLongitude(0.0F)
                        .allowedRadius(1.0F)
                        .checkIfVoted(false)
                        .psaEnabled(false)
                        .jukeboxRequestLimit(0)
                        .hideSequenceCount(0)
                        .makeItSnow(false)
                        .managePsa(false)
                        .sequencesPlayed(0)
                        .build())
                .stats(Stat.builder()
                        .jukebox(new ArrayList<>())
                        .page(new ArrayList<>())
                        .voting(new ArrayList<>())
                        .votingWin(new ArrayList<>())
                        .build())
                .pages(new ArrayList<>())
                .sequences(new ArrayList<>())
                .sequenceGroups(new ArrayList<>())
                .psaSequences(new ArrayList<>())
                .build();
    }

    private String validateShowToken(String showToken) {
        Optional<Show> show = this.showRepository.findByShowToken(showToken);
        if(show.isEmpty()) {
            return showToken;
        }else {
            validateShowToken(RandomUtil.generateToken(25));
        }
        return null;
    }

    public Boolean forgotPassword(String email) {
        Optional<Show> show = this.showRepository.findByEmail(email);
        if(show.isPresent()) {
            String passwordResetLink = RandomUtil.generateToken(25);
            show.get().setPasswordResetLink(passwordResetLink);
            show.get().setPasswordResetExpiry(LocalDateTime.now().plusDays(1));
            this.showRepository.save(show.get());
            Response response = this.emailUtil.sendForgotPasswordEmail(show.get(), passwordResetLink);
            if(response.getStatusCode() != 202) {
                throw new RuntimeException(StatusResponse.EMAIL_CANNOT_BE_SENT.name());
            }
            return true;
        }
        throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
    }

    public Boolean verifyEmail(String showToken) {
        Optional<Show> show = this.showRepository.findByShowToken(showToken);
        if(show.isPresent()) {
            show.get().setEmailVerified(true);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
    }

    public Boolean resetPassword() {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isEmpty()) {
            throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
        }
        String updatedPassword = this.authUtil.getPasswordFromHeader(httpServletRequest);
        if (updatedPassword != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode(updatedPassword);
            show.get().setPassword(hashedPassword);
            show.get().setPasswordResetLink(null);
            show.get().setPasswordResetExpiry(null);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
    }

    public Boolean updatePassword() {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            String password = this.authUtil.getPasswordFromHeader(httpServletRequest);
            String updatedPassword = this.authUtil.getUpdatedPasswordFromHeader(httpServletRequest);
            if (updatedPassword != null) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                boolean passwordsMatch = passwordEncoder.matches(password, show.get().getPassword());
                if(passwordsMatch) {
                    String hashedPassword = passwordEncoder.encode(updatedPassword);
                    show.get().setPassword(hashedPassword);
                    this.showRepository.save(show.get());
                    return true;
                }else {
                    throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
                }
            }
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean updateUserProfile(UserProfile userProfile) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setUserProfile(userProfile);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean requestApiAccess() {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            if(show.get().getApiAccess().getApiAccessActive()) {
                throw new RuntimeException(StatusResponse.API_ACCESS_REQUESTED.name());
            }
            String accessToken = RandomUtil.generateToken(20);
            String secretKey = RandomUtil.generateToken(20);
            show.get().getApiAccess().setApiAccessActive(true);
            show.get().getApiAccess().setApiAccessToken(accessToken);
            show.get().getApiAccess().setApiAccessSecret(secretKey);
            this.showRepository.save(show.get());
            Response response = this.emailUtil.sendRequestApiAccessEmail(show.get(), accessToken, secretKey);
            if(response.getStatusCode() != 202) {
                show.get().getApiAccess().setApiAccessActive(true);
                show.get().getApiAccess().setApiAccessToken(accessToken);
                show.get().getApiAccess().setApiAccessSecret(secretKey);
                this.showRepository.save(show.get());
                throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
            }
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean deleteAccount() {
        this.showRepository.deleteByShowToken(authUtil.tokenDTO.getShowToken());
        return true;
    }

    public Boolean updateShow(String email, String showName) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            boolean changesMade = false;
            if(!StringUtils.equalsIgnoreCase(show.get().getEmail(), email)) {
                changesMade = true;
                show.get().setEmailVerified(false);
                show.get().setEmail(email);
                Response emailResponse = this.emailUtil.sendSignUpEmail(show.get());
                if(emailResponse.getStatusCode() != 202) {
                    show.get().setEmailVerified(true);
                    show.get().setEmail(show.get().getEmail());
                    throw new RuntimeException(StatusResponse.EMAIL_CANNOT_BE_SENT.name());
                }
            }
            if(!StringUtils.equalsIgnoreCase(show.get().getShowName(), showName)) {
                changesMade = true;
                String showSubdomain = showName.replaceAll("\\s", "").toLowerCase();
                show.get().setShowName(showName);
                show.get().setShowSubdomain(showSubdomain);
            }
            if(changesMade) {
                this.showRepository.save(show.get());
            }
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean updatePreferences(Preference preferences) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setPreferences(preferences);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean updatePages(List<Page> pages) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setPages(pages);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean updatePsaSequences(List<PsaSequence> psaSequences) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setPsaSequences(psaSequences);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean updateSequences(List<Sequence> sequences) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setSequences(sequences);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean updateSequenceGroups(List<SequenceGroup> sequenceGroups) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setSequenceGroups(sequenceGroups);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean playSequenceFromControlPanel(Sequence sequence) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean deleteSingleRequest(Integer position) {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            List<Request> updatedRequests = show.get().getRequests().stream()
                    .filter(request -> !Objects.equals(request.getPosition(), position))
                    .toList();
            int requestPosition = 1;
            for(Request request : updatedRequests) {
                request.setPosition(requestPosition);
                requestPosition++;
            }
            if(updatedRequests.isEmpty()) {
                show.get().setPlayingNext("");
            }else {
                show.get().setPlayingNext(updatedRequests.get(0).getSequence().getDisplayName());
            }
            show.get().setRequests(updatedRequests);
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean deleteAllRequests() {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setRequests(new ArrayList<>());
            show.get().setPlayingNext("");
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }

    public Boolean resetAllVotes() {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setVotes(new ArrayList<>());
            this.showRepository.save(show.get());
            return true;
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }
}
