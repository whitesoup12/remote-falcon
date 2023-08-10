package com.remotefalcon.api.repository;

import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.entity.RemotePreference;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemotePreferencePagingRepository extends PagingAndSortingRepository<RemotePreference, Integer> {

}
