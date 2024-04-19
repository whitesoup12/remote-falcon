package com.remotefalcon.controlpanel.repository;

import com.remotefalcon.controlpanel.entity.RemotePreference;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RemotePreferencePagingRepository extends PagingAndSortingRepository<RemotePreference, Integer> {

}
