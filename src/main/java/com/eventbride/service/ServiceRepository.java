package com.eventbride.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface ServiceRepository extends CrudRepository<Service, Long> {  
    Optional<Service> findByName(String name);
    List<Service> findAll();
    Service save(Service service);
}
