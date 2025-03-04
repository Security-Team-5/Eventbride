package com.eventbride.otherService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.otherService.OtherService.OtherServiceType;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;
import java.util.List;



@Service
public class OtherServiceService {

    @Autowired
    private OtherServiceRepository otherServiceRepo;

    @Transactional
    public List<OtherService> getAllOtherServices() {
        return otherServiceRepo.findAll();
    }

    @Transactional 
    public Optional<OtherService> getOtherServiceById(Integer id) {
        return otherServiceRepo.findById(id);
    }

    @Transactional
    public Optional<OtherService> getOtherServiceByServiceName(String serviceName) {
        return otherServiceRepo.findByName(serviceName);
    }

    @Transactional
    public List<OtherService> getOtherServiceByUserId(Integer userId) {
        return otherServiceRepo.findByUserId(userId);
    }

    @Transactional
    public List<OtherService> getOtherServiceByAvailableCity(String cityAvailable) {
        return otherServiceRepo.findByCityAvailable(cityAvailable);
    }

    @Transactional
    public List<OtherService> getOtherServiceByOtherServiceType(OtherServiceType otherServiceType) {
        return otherServiceRepo.findByOtherServiceType(otherServiceType);
    }

    @Transactional
    public List<OtherService> getOtherServiceByAvailability(Boolean available) {
        return otherServiceRepo.findByAvailable(available);
    }


    @Transactional
    public OtherService createOtherService(OtherService otherService) {
        if (otherService.getId() != null) {
            throw new RuntimeException("No se puede registrar un servicio con Id ya existente");
        }

        if(otherServiceRepo.existsByName(otherService.getName())) {
            throw new RuntimeException("Ya existe un servicio con ese nombre, introduce otro");
        }
        return otherServiceRepo.save(otherService);
    }

    @Transactional
    public OtherService updateOtherService(Integer id, OtherService otherServ){
        OtherService otherService = otherServiceRepo.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado ningun servicio con esa Id"));

        otherService.setName(otherServ.getName());
        otherService.setAvailable(otherServ.getAvailable());
        otherService.setCityAvailable(otherServ.getCityAvailable());
        otherService.setServicePrice(otherServ.getServicePrice());
        otherService.setPicture(otherServ.getPicture());
        otherService.setDescription(otherServ.getDescription());
        otherService.setOtherServiceType(otherServ.getOtherServiceType());
        otherService.setExtraInformation(otherServ.getExtraInformation());

        return otherServiceRepo.save(otherService);

    }


    @Transactional
    public void deleteUser(Integer id) {
        otherServiceRepo.deleteById(id);
    }
    

}
