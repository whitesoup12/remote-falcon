package com.remotefalcon.api.service;

import com.remotefalcon.api.documents.Show;
import com.remotefalcon.api.enums.StatusResponse;
import com.remotefalcon.api.enums.ViewerControlMode;
import com.remotefalcon.api.repository.mongo.ShowRepository;
import com.remotefalcon.api.util.AuthUtil;
import com.remotefalcon.api.util.ClientUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GraphQLQueryService {
    private final AuthUtil authUtil;
    private final ClientUtil clientUtil;
    private final ShowRepository showRepository;
    private final HttpServletRequest httpServletRequest;

    public Show signIn() {
        String[] basicAuthCredentials = this.authUtil.getBasicAuthCredentials(httpServletRequest);
        if (basicAuthCredentials != null) {
            String ipAddress = this.clientUtil.getClientIp(httpServletRequest);
            String email = basicAuthCredentials[0];
            String password = basicAuthCredentials[1];
            Optional<Show> optionalShow = this.showRepository.findByEmail(email);
            if (optionalShow.isEmpty()) {
                throw new RuntimeException(StatusResponse.SHOW_NOT_FOUND.name());
            }
            Show show = optionalShow.get();
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            boolean passwordsMatch = passwordEncoder.matches(password, show.getPassword());
            if (passwordsMatch) {
                if (!show.getEmailVerified()) {
                    throw new RuntimeException(StatusResponse.EMAIL_NOT_VERIFIED.name());
                }
                show.setLastLoginDate(LocalDateTime.now());
                show.setExpireDate(LocalDateTime.now().plusYears(1));
                show.setLastLoginIp(ipAddress);
                if(show.getPreferences().getViewerControlMode() == null) {
                    show.getPreferences().setViewerControlMode(ViewerControlMode.JUKEBOX);
                }
                this.showRepository.save(show);
                show.setServiceToken(this.authUtil.signJwt(show));
                return show;
            }
        }
        throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
    }

    public Show verifyPasswordResetLink(String passwordResetLink) {
        Optional<Show> show = this.showRepository.findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(passwordResetLink, LocalDateTime.now());
        if(show.isPresent()) {
            String jwt = this.authUtil.signJwt(show.get());
            show.get().setServiceToken(jwt);
            return show.get();
        }
        throw new RuntimeException(StatusResponse.UNAUTHORIZED.name());
    }

    public Show getShow() {
        Optional<Show> show = this.showRepository.findByShowToken(authUtil.tokenDTO.getShowToken());
        if(show.isPresent()) {
            show.get().setLastLoginDate(LocalDateTime.now());
            this.showRepository.save(show.get());
            return show.get();
        }
        throw new RuntimeException(StatusResponse.UNEXPECTED_ERROR.name());
    }
}
