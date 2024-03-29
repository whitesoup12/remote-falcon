package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.EasterEgg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EasterEggRepository extends JpaRepository<EasterEgg, Integer> {
  Optional<EasterEgg> findByRemoteToken(String remoteToken);
}
