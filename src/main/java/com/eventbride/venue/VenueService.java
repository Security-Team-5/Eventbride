package com.eventbride.venue;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.service.ServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

	@Autowired
	private UserService userService;

	@Autowired
	private ServiceService serviceService;


	@Transactional
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    @Transactional
    public Optional<Venue> getVenueById(Integer id) {
        return venueRepository.findById(id);
    }

    @Transactional
    public List<Venue> getFilteredVenues(String city, Integer maxGuests, Double surface) {
        return venueRepository.findByFilters(
            city,
            maxGuests != null ? maxGuests : 0,
            surface != null ? surface : 0.0
        );
    }
    
    public Venue save(Venue venue) {
		Optional<User> user = userService.getUserById(venue.getUser().getId());
		if(user.isPresent()){
			ServiceDTO allServices = serviceService.getAllServiceByUserId(venue.getUser().getId());
			int slotsCount = allServices.getOtherServices().size() + allServices.getVenues().size();
			if(slotsCount > 3) {
				throw new RuntimeException("Slot count exceeded");
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

        // Actualizar las propiedades heredadas de Service
        existingVenue.setName(venue.getName());
        existingVenue.setAvailable(venue.getAvailable());
        existingVenue.setCityAvailable(venue.getCityAvailable());
        existingVenue.setServicePricePerGuest(venue.getServicePricePerGuest());
        existingVenue.setServicePricePerHour(venue.getServicePricePerHour());
        existingVenue.setFixedPrice(venue.getFixedPrice());
        existingVenue.setPicture(venue.getPicture());
        existingVenue.setDescription(venue.getDescription());
        existingVenue.setHours(venue.getHours());
        existingVenue.setLimitedByPricePerGuest(venue.getLimitedByPricePerGuest());
        existingVenue.setLimitedByPricePerHour(venue.getLimitedByPricePerHour());

        // Actualizar las propiedades específicas de Venue
        existingVenue.setPostalCode(venue.getPostalCode());
        existingVenue.setCoordinates(venue.getCoordinates());
        existingVenue.setAddress(venue.getAddress());
        existingVenue.setSurface(venue.getSurface());
        existingVenue.setMaxGuests(venue.getMaxGuests());

        return venueRepository.save(existingVenue);
    }


	@Transactional
	public List<Venue> getVenuesByUserId(Integer userId) {
		return venueRepository.findByUserId(userId);
	}

}
