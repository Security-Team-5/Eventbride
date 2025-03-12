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

        // Guardar el Venue actualizado
        return venueRepository.save(existingVenue);
    }

    public void saveAll(List<Venue> venues) {
        venueRepository.saveAll(venues);
    }
    

}
