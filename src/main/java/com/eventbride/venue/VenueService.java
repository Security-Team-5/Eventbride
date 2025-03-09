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
	public List<Venue> getVenuesByUserId(Integer userId) {
		return venueRepository.findByUserId(userId);
	}

}
