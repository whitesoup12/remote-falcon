package com.remotefalcon.api.repository;

import com.remotefalcon.api.documents.Show;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ShowRepository extends MongoRepository<Show, String> {
    Optional<Show> findByShowToken(String showToken);
    Optional<Show> findByEmailOrShowSubdomain(String email, String showName);
    Optional<Show> findByEmail(String email);
}
