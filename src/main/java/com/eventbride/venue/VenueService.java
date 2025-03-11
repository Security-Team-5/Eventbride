package com.eventbride.venue;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.event_properties.EventPropertiesRepository;
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

    @Autowired
    private EventPropertiesRepository eventPropertiesRepository;

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
        if (user.isPresent()) {
            ServiceDTO allServices = serviceService.getAllServiceByUserId(venue.getUser().getId());
            int slotsCount = allServices.getOtherServices().size() + allServices.getVenues().size();
            if (slotsCount > 3) {
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

    @Transactional
    public void deleteVenue(Integer id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        // Eliminar EventProperties asociadas al Venue
        eventPropertiesRepository.deleteByVenue(venue);

        // Eliminar Venue
        venueRepository.deleteById(id);
    }

    public Venue updateVenue(Integer id, Venue venueDetails) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id " + id));
        
        venue.setName(venueDetails.getName());
        venue.setAvailable(venueDetails.getAvailable());
        venue.setCityAvailable(venueDetails.getCityAvailable());
        venue.setServicePricePerGuest(venueDetails.getServicePricePerGuest());
        venue.setServicePricePerHour(venueDetails.getServicePricePerHour());
        venue.setFixedPrice(venueDetails.getFixedPrice());
        venue.setPicture(venueDetails.getPicture());
        venue.setDescription(venueDetails.getDescription());
        venue.setHours(venueDetails.getHours());
        venue.setLimitedByPricePerGuest(venueDetails.getLimitedByPricePerGuest());
        venue.setLimitedByPricePerHour(venueDetails.getLimitedByPricePerHour());

        venue.setPostalCode(venueDetails.getPostalCode());
        venue.setCoordinates(venueDetails.getCoordinates());
        venue.setAddress(venueDetails.getAddress());
        venue.setMaxGuests(venueDetails.getMaxGuests());
        venue.setSurface(venueDetails.getSurface());
        venue.setUser(venueDetails.getUser());

        return venueRepository.save(venue);
    }
}
