package com.eventbride.otherService;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.BeanUtils;

import com.eventbride.otherService.OtherService.OtherServiceType;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.Comparator;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import com.eventbride.event_properties.EventPropertiesRepository;

@Service
public class OtherServiceService {

    @Autowired
    private OtherServiceRepository otherServiceRepo;

    @Autowired
    private UserService userService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private EventPropertiesRepository eventPropertiesRepository;

    @Transactional
    public List<OtherService> getAllOtherServices() {
        return otherServiceRepo.findAll().stream()
			.sorted(Comparator.comparing(
				os -> os.getUser().getPlan() == User.Plan.PREMIUM ? 0 : 1
			))
			.collect(Collectors.toList());
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
        return otherServiceRepo.findByFilters(name, city, type).stream().sorted(Comparator.comparing(
				os -> os.getUser().getPlan() == User.Plan.PREMIUM ? 0 : 1
			))
			.collect(Collectors.toList());
    }

    @Transactional
    public OtherService createOtherService(OtherService otherService) {
        Optional<User> user = userService.getUserById(otherService.getUser().getId());

        if (user.isPresent()) {
            User existingUser = user.get();
            ServiceDTO allServices = serviceService.getAllServiceByUserId(existingUser.getId());

            int slotsCount = allServices.getOtherServices().size() + allServices.getVenues().size();

            String plan = existingUser.getPlan() == null ? "BASIC" : existingUser.getPlan().toString();

            if ("BASIC".equalsIgnoreCase(plan) && slotsCount >= 3) {
                throw new RuntimeException("Has alcanzado el límite de servicios en el plan BASIC.");
            } else if ("PREMIUM".equalsIgnoreCase(plan) && slotsCount >= 10) {
                throw new RuntimeException("Has alcanzado el límite de servicios en el plan PREMIUM.");
            }

            otherService.setUser(existingUser);
        } else {
            throw new RuntimeException("User not found");
        }

        return otherServiceRepo.save(otherService);
    }

    @Transactional
    public OtherService updateOtherService(Integer id, OtherService otherServ) {
        OtherService otherService = otherServiceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado ningun servicio con esa Id"));

        BeanUtils.copyProperties(otherServ, otherService, "id");

        return otherServiceRepo.save(otherService);

    }

    @Transactional
    public void deleteOtherService(Integer id) {
        OtherService otherService = otherServiceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("OtherService not found"));

        // Elimina EventProperties asociadas para evitar fallos con la foreign key
        eventPropertiesRepository.deleteByOtherService(otherService);

        // Elimina OtherService
        otherServiceRepo.delete(otherService);
    }

    @Transactional
    public void deleteUser(Integer id) {
        otherServiceRepo.deleteById(id);
    }

    @Transactional
    public void saveAll(List<OtherService> otherServices) {
        otherServiceRepo.saveAll(otherServices);
    }

    public void save(OtherService service) {
        otherServiceRepo.save(service);
    }
}
