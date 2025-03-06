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

}