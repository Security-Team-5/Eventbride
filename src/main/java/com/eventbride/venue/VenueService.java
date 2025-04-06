package com.eventbride.venue;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private EventPropertiesRepository eventPropertiesRepository;

    @Transactional
    public List<Venue> getAllVenues() {
		return venueRepository.findAll().stream()
			.sorted(Comparator.comparing(
				os -> os.getUser().getPlan() == User.Plan.PREMIUM ? 0 : 1
			))
			.collect(Collectors.toList());
    }

    @Transactional
    public Optional<Venue> getVenueById(Integer id) {
        return venueRepository.findById(id);
    }


	@Transactional
	public List<Venue> getVenuesByUserId(Integer userId) {
		return venueRepository.findByUserId(userId);
	}

    @Transactional
    public List<Venue> getFilteredVenues(String city, Integer maxGuests, Double surface) {
        return venueRepository.findByFilters(
            city,
            maxGuests != null ? maxGuests : 0,
            surface != null ? surface : 0.0
        ).stream()
			.sorted(Comparator.comparing(
				os -> os.getUser().getPlan() == User.Plan.PREMIUM ? 0 : 1
			))
			.collect(Collectors.toList());
    }

    public Venue save(Venue venue) {
        Optional<User> user = userService.getUserById(venue.getUser().getId());
        if (user.isPresent()) {
            User existingUser = user.get();
            ServiceDTO allServices = serviceService.getAllServiceByUserId(venue.getUser().getId());
            int slotsCount = allServices.getOtherServices().size() + allServices.getVenues().size();

            String plan = existingUser.getPlan() == null ? "BASIC" : existingUser.getPlan().toString();

            if ("BASIC".equalsIgnoreCase(plan) && slotsCount >= 3) {
                throw new RuntimeException("Has alcanzado el límite de venues en el plan BASIC.");
            } else if ("PREMIUM".equalsIgnoreCase(plan) && slotsCount >= 10) {
                throw new RuntimeException("Has alcanzado el límite de venues en el plan PREMIUM.");
            }

            venue.setUser(user.get());
        } else {
            throw new RuntimeException("User not found");
        }
        return venueRepository.save(venue);
    }

    @Transactional

    public Venue update(Integer id, Venue venue) {
        Venue existingVenue = venueRepository.findById(id).orElse(null);
        if (existingVenue == null) {
            throw new RuntimeException("Venue not found");
        }
        BeanUtils.copyProperties(venue, existingVenue, "id");

        return venueRepository.save(existingVenue);
    }

	@Transactional
	public Venue updateVenue(Integer id, Venue updatedVenue) {

		Venue existingVenue = venueRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("No se ha encontrado ningun Venue con esa Id"));

		existingVenue.setName(updatedVenue.getName());
		existingVenue.setAvailable(updatedVenue.getAvailable());
		existingVenue.setCityAvailable(updatedVenue.getCityAvailable());
		existingVenue.setServicePricePerGuest(updatedVenue.getServicePricePerGuest());
		existingVenue.setServicePricePerHour(updatedVenue.getServicePricePerHour());
		existingVenue.setFixedPrice(updatedVenue.getFixedPrice());
		existingVenue.setPicture(updatedVenue.getPicture());
		existingVenue.setDescription(updatedVenue.getDescription());
		existingVenue.setLimitedByPricePerGuest(updatedVenue.getLimitedByPricePerGuest());
		existingVenue.setLimitedByPricePerHour(updatedVenue.getLimitedByPricePerHour());

		existingVenue.setAddress(updatedVenue.getAddress());
		existingVenue.setPostalCode(updatedVenue.getPostalCode());
		existingVenue.setCoordinates(updatedVenue.getCoordinates());
		existingVenue.setMaxGuests(updatedVenue.getMaxGuests());
		existingVenue.setSurface(updatedVenue.getSurface());
        existingVenue.setEarliestTime(updatedVenue.getEarliestTime());
        existingVenue.setLatestTime(updatedVenue.getLatestTime());

		// Guardar el Venue actualizado
		return venueRepository.save(existingVenue);
	}

	@Transactional
	public void deleteVenue(Integer id) {
		Venue venue = venueRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Venue not found"));

		// Eliminar EventProperties asociadas al Venue
		eventPropertiesRepository.deleteByVenue(venue);


		// Eliminar Venue
		venueRepository.deleteById(id);
	}

	public void saveAll(List<Venue> venues) {
		venueRepository.saveAll(venues);
	}

}
