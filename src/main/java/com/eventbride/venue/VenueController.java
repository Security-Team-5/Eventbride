package com.eventbride.venue;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.dto.VenueDTO;

import jakarta.validation.Valid;

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
    public ResponseEntity<?> createVenue(@Valid @RequestBody Venue venue) {
        try {
            Venue newVenue = venueService.save(venue);
            return ResponseEntity.ok(new VenueDTO(newVenue));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
