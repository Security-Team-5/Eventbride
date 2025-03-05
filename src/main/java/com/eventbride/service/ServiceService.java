package com.eventbride.service;

import org.springframework.transaction.annotation.Transactional;

public class ServiceService {
    ServiceRepository serviceRepository;

    @Transactional
    public Service saveService(Service service) {
        return serviceRepository.save(service);
    }

    @Transactional
    public Service createService(Service service) {
        return saveService(service);
    }
}
