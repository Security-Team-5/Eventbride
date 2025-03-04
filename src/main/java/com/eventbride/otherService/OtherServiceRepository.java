package com.eventbride.otherService;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.eventbride.otherService.OtherService.OtherServiceType;

@Repository
public interface OtherServiceRepository extends JpaRepository<OtherService, Integer> {

    Optional<OtherService> findById(Integer id);

    Optional<OtherService> findByName(String serviceName);

    Boolean existsByName(String serviceName);

    List<OtherService> findByUserId(Integer userId);

    List<OtherService> findByCityAvailable(String cityAvailable);

    List<OtherService> findByOtherServiceType(OtherServiceType otherServiceType);

    List<OtherService> findByAvailable(Boolean available);
    
}
