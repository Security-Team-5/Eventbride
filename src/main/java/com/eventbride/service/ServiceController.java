package com.eventbride.service;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/services")
public class ServiceController {

	@Autowired
	private OtherServiceService otherServiceService;

	@Autowired
	private VenueService venueService;

	@GetMapping("/user/{id}")
	public ResponseEntity<ServiceDTO> getServicesByUserId(@PathVariable Integer id) {
		List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(id);
		List<Venue> venues = venueService.getVenuesByUserId(id);
		return new ResponseEntity<>(new ServiceDTO(otherServices, venues), HttpStatus.OK);
	}

	@GetMapping("/{id}")
    public ResponseEntity<Object> getServiceById(@PathVariable Integer id) {
        Optional<OtherService> otherService = otherServiceService.getOtherServiceById(id);
        if (otherService.isPresent()) {
            return new ResponseEntity<>(new ServiceDTO(otherService.get()), HttpStatus.OK);
        }
	
        Optional<Venue> venue = venueService.getVenueById(id);
        if (venue.isPresent()) {
            return new ResponseEntity<>(new ServiceDTO(venue.get()), HttpStatus.OK);
        }
	
        return new ResponseEntity<>("Service not found", HttpStatus.NOT_FOUND);
    }
}
