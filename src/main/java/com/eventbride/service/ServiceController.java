package com.eventbride.service;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.UserService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

	@Autowired
	private OtherServiceService otherServiceService;

	@Autowired
	private VenueService venueService;
	@Autowired
	private UserService userService;

	@GetMapping("/user/{id}")
	public ResponseEntity<ServiceDTO> getServicesByUserId(@PathVariable Integer id) {
		List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(id);
		List<Venue> venues = venueService.getVenuesByUserId(id);
		return new ResponseEntity<>(new ServiceDTO(otherServices, venues), HttpStatus.OK);
	}


	@GetMapping("/admin")
    public ResponseEntity<List<ServiceDTO>> getAllServices() {

		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
		if(roles.contains("ADMIN")) {
			List<OtherService> allOtherServices = otherServiceService.getAllOtherServices();
			List<Venue> allVenues = venueService.getAllVenues();
			List<ServiceDTO> allServices = new ArrayList<>();
			allServices.add(new ServiceDTO(allOtherServices, allVenues));
			return new ResponseEntity<List<ServiceDTO>>(allServices, HttpStatus.CREATED);
		}

		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

	@GetMapping("/{id}")
    public ResponseEntity<Object> getServiceById(@PathVariable Integer id) {
        Optional<OtherService> otherService = otherServiceService.getOtherServiceById(id);
            return new ResponseEntity<>(new ServiceDTO(otherService.get()), HttpStatus.OK);
        }
	
        Optional<Venue> venue = venueService.getVenueById(id);
        if (venue.isPresent()) {
            return new ResponseEntity<>(new ServiceDTO(venue.get()), HttpStatus.OK);
        }
	
        return new ResponseEntity<>("Service not found", HttpStatus.NOT_FOUND);
    }
}
