package com.eventbride.venue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

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

}