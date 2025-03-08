package com.eventbride.venue;

import java.util.List;
import jakarta.validation.Valid;;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.dto.VenueDTO;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/venues")
public class VenueController {

    @Autowired
    private VenueService venueService;


    @GetMapping
    public ResponseEntity<List<VenueDTO>> getAllVenues() {
        List<Venue> venues = venueService.getAllVenues();
        if (venues.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(VenueDTO.fromEntities(venues));
    }

    @GetMapping("/filter")
    public List<Venue> getFilteredVenues(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer maxGuests,
            @RequestParam(required = false) Double surface) {
        return venueService.getFilteredVenues(city, maxGuests, surface);
    }

    @PostMapping
    public ResponseEntity<Venue> saveVenue(@Valid @RequestBody Venue venue) {
        try {
            Venue newVenue = venueService.save(venue);
            return ResponseEntity.ok(newVenue);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}