package com.eventbride.otherService;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.BeanUtils;

import com.eventbride.otherService.OtherService.OtherServiceType;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
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
	private VenueRepository venueRepository;

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
                        os -> {
                            if (os.getUser() == null || os.getUser().getPlan() == null) {
                                return 1; // Puede devolver cualquier valor que no afecte al orden, en caso de que sea
                                          // nulo
                            }
                            return os.getUser().getPlan() == User.Plan.PREMIUM ? 0 : 1;
                        }))
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
                os -> os.getUser().getPlan() == User.Plan.PREMIUM ? 0 : 1))
                .collect(Collectors.toList());
    }

    @Transactional
    public OtherService createOtherService(OtherService otherService) throws IllegalArgumentException{
		if(otherService.getAvailable()){
			Optional<User> user = userService.getUserById(otherService.getUser().getId());

			if (user.isPresent()) {
				User existingUser = user.get();
				List<com.eventbride.service.Service> allServices = new ArrayList<>();
				List<OtherService> otherServices = otherServiceRepo.findByUserId(user.get().getId());
				List<Venue> venues = venueRepository.findByUserId(user.get().getId());

				allServices.addAll(otherServices);
				allServices.addAll(venues);

				allServices = allServices.stream().filter(s -> s.getAvailable()).toList();

				int slotsCount = allServices.size();

				String plan = existingUser.getPlan() == null ? "BASIC" : existingUser.getPlan().toString();

				if ("BASIC".equalsIgnoreCase(plan) && slotsCount >= 3) {
					throw new IllegalArgumentException("Has alcanzado el límite de servicios en el plan BASIC.");
				} else if ("PREMIUM".equalsIgnoreCase(plan) && slotsCount >= 10) {
					throw new IllegalArgumentException("Has alcanzado el límite de servicios en el plan PREMIUM.");
				}

				otherService.setUser(existingUser);
			} else {
				throw new IllegalArgumentException("User not found");
			}
		}

        return otherServiceRepo.save(otherService);
    }

    @Transactional
    public OtherService updateOtherService(Integer id, OtherService otherServ) {
        OtherService existingService = otherServiceRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("No se ha encontrado ningún servicio con esa Id"));
    
        BeanUtils.copyProperties(otherServ, existingService, "id", "user");
    
        if (otherServ.getUser().getId() == null) {
            throw new RuntimeException("Falta el usuario al actualizar el servicio.");
        }
    
        User user = userService.getUserById(otherServ.getUser().getId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
        existingService.setUser(user);
    
        return otherServiceRepo.save(existingService);
    }

    @Transactional
    public void deleteOtherService(Integer id) {
        OtherService otherService = otherServiceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("OtherService not found"));

        // Elimina EventProperties asociadas para evitar fallos con la foreign key
        eventPropertiesRepository.deleteByOtherService(otherService);
        // Elimina Ratings asociadas para evitar fallos con la foreign key

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

    public OtherService save(OtherService otherService) {
		if(otherService.getAvailable()){
			Optional<User> user = userService.getUserById(otherService.getUser().getId());

			if (user.isPresent()) {
				User existingUser = user.get();
				List<com.eventbride.service.Service> allServices = new ArrayList<>();
				List<OtherService> otherServices = otherServiceRepo.findByUserId(user.get().getId());
				List<Venue> venues = venueRepository.findByUserId(user.get().getId());

				allServices.addAll(otherServices);
				allServices.addAll(venues);

				allServices = allServices.stream().filter(s -> s.getAvailable()).toList();

				int slotsCount = allServices.size();

				String plan = existingUser.getPlan() == null ? "BASIC" : existingUser.getPlan().toString();

				if ("BASIC".equalsIgnoreCase(plan) && slotsCount >= 3) {
					throw new IllegalArgumentException("Has alcanzado el límite de servicios en el plan BASIC.");
				} else if ("PREMIUM".equalsIgnoreCase(plan) && slotsCount >= 10) {
					throw new IllegalArgumentException("Has alcanzado el límite de servicios en el plan PREMIUM.");
				}

				otherService.setUser(existingUser);
			} else {
				throw new IllegalArgumentException("User not found");
			}
		}
		return otherServiceRepo.save(otherService);
    }
}
