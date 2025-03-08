package com.eventbride.otherService;

import com.eventbride.config.jwt.services.UserManagementService;
import com.eventbride.dto.ReqRes;
import com.eventbride.dto.ServiceDTO;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
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

	@Autowired
	private UserService userService;

	@Autowired
	private ServiceService serviceService;

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
    public List<OtherService> getFilteredOtherServices(String name, String city, OtherServiceType type) {
        return otherServiceRepo.findByFilters(name, city, type);
    }


    @Transactional
    public OtherService createOtherService(OtherService otherService) {
		Optional<User> user = userService.getUserById(otherService.getUser().getId());
		if(user.isPresent()){
			ServiceDTO allServices = serviceService.getAllServiceByUserId(otherService.getUser().getId());
			int slotsCount = allServices.getOtherServices().size() + allServices.getVenues().size();
			if(slotsCount > 3) {
				throw new RuntimeException("Slot count exceeded");
			}
			otherService.setUser(user.get());

		} else {
			throw new RuntimeException("User not found");
		}
        return otherServiceRepo.save(otherService);
    }

    @Transactional
    public OtherService updateOtherService(Integer id, OtherService otherServ){
        OtherService otherService = otherServiceRepo.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado ningun servicio con esa Id"));

        // Actualizar las propiedades heredadas de Service
        otherService.setName(otherServ.getName());
        otherService.setAvailable(otherServ.getAvailable());
        otherService.setCityAvailable(otherServ.getCityAvailable());
        otherService.setServicePricePerGuest(otherServ.getServicePricePerGuest());
        otherService.setServicePricePerHour(otherServ.getServicePricePerHour());
        otherService.setFixedPrice(otherServ.getFixedPrice());
        otherService.setPicture(otherServ.getPicture());
        otherService.setDescription(otherServ.getDescription());
        otherService.setHours(otherServ.getHours());
        otherService.setLimitedByPricePerGuest(otherServ.getLimitedByPricePerGuest());
        otherService.setLimitedByPricePerHour(otherServ.getLimitedByPricePerHour());

        // Actualizar las propiedades específicas de OtherService
        otherService.setOtherServiceType(otherServ.getOtherServiceType());
        otherService.setExtraInformation(otherServ.getExtraInformation());

        return otherServiceRepo.save(otherService);

    }


    @Transactional
    public void deleteUser(Integer id) {
        otherServiceRepo.deleteById(id);
    }


}
