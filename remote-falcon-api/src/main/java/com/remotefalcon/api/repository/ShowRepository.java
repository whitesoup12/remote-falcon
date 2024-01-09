package com.remotefalcon.api.repository;

import com.remotefalcon.api.documents.Show;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ShowRepository extends MongoRepository<Show, String> {
    Optional<Show> findByShowToken(String showToken);
    Optional<Show> findByShowSubdomain(String showSubdomain);
    Optional<Show> findByEmailOrShowSubdomain(String email, String showSubdomain);
    Optional<Show> findByEmail(String email);
    Optional<Show> findByPasswordResetLinkAndPasswordResetExpiryGreaterThan(String passwordResetLink,
                                                                            LocalDateTime passwordResetExpiry);
}
