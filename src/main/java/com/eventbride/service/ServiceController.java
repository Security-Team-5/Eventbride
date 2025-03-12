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

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

	@Autowired
	private OtherServiceService otherServiceService;

	@Autowired
	private VenueService venueService;

	@GetMapping("/{id}")
	public ResponseEntity<ServiceDTO> getServicesByUserId(@PathVariable Integer id) {
		List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(id);
		List<Venue> venues = venueService.getVenuesByUserId(id);
		return new ResponseEntity<>(new ServiceDTO(otherServices, venues), HttpStatus.OK);
	}
}
