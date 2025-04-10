package com.eventbride.service;

import com.eventbride.dto.ServiceDTO;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesService;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.User;
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
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
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
	private EventPropertiesService eventPropertiesService;
	@Autowired
	private final UserService userService;

	public ServiceController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/user/{id}")
	public ResponseEntity<ServiceDTO> getServicesByUserId(@PathVariable Integer id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
		User user = userService.getUserByUsername(auth.getName())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
		Integer userId = user.getId();

		if (roles.contains("SUPPLIER") && !roles.contains("ADMIN")) {
			User userDetails = (User) auth.getPrincipal();
			if (!userDetails.getId().equals(id)) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN,
						"Access denied: Solo puedes ver tus propios servicios");
			}
		}

		if (!roles.contains("SUPPLIER") && !roles.contains("ADMIN")) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}

		List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(id);
		List<Venue> venues = venueService.getVenuesByUserId(id);
		return new ResponseEntity<>(new ServiceDTO(otherServices, venues), HttpStatus.OK);
	}

	@GetMapping("/admin")
	public ResponseEntity<List<ServiceDTO>> getAllServices() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
		if (roles.contains("ADMIN")) {
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
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());

		if (!roles.contains("SUPPLIER") && !roles.contains("ADMIN")) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}

		User user = userService.getUserByUsername(auth.getName())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
		Integer authUserId = user.getId();

		Optional<OtherService> otherServiceOpt = otherServiceService.getOtherServiceById(id);
		Optional<Venue> venueOpt = venueService.getVenueById(id);

		if (!otherServiceOpt.isPresent() && !venueOpt.isPresent()) {
			return new ResponseEntity<>("Service not found", HttpStatus.NOT_FOUND);
		}

		if (roles.contains("ADMIN")) {
			List<OtherService> otherServices = new ArrayList<>();
			List<Venue> venues = new ArrayList<>();
			otherServiceOpt.ifPresent(otherServices::add);
			venueOpt.ifPresent(venues::add);

			return new ResponseEntity<>(new ServiceDTO(otherServices, venues), HttpStatus.OK);
		}

		if (roles.contains("SUPPLIER")) {
			if (otherServiceOpt.isPresent()) {
				OtherService otherService = otherServiceOpt.get();
				if (otherService.getUser().getId().equals(authUserId)) {
					return new ResponseEntity<>(new ServiceDTO(otherService), HttpStatus.OK);
				}
			}

			if (venueOpt.isPresent()) {
				Venue venue = venueOpt.get();
				if (venue.getUser().getId().equals(authUserId)) {
					return new ResponseEntity<>(new ServiceDTO(venue), HttpStatus.OK);
				}
			}

			throw new ResponseStatusException(HttpStatus.FORBIDDEN,
					"Access denied: no tienes permiso para ver este recurso");
		}

		throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
	}

	@GetMapping("/solicitudes/{id}") // la id es del proveedor
	public ResponseEntity<ServiceDTO> getRequestsPerSupplierService(@PathVariable Integer id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.toList());

		if (!roles.contains("SUPPLIER") && !roles.contains("ADMIN")) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
		}

		User user = userService.getUserByUsername(auth.getName())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
		Integer authUserId = user.getId();

		if (roles.contains("SUPPLIER") && !roles.contains("ADMIN")) {
			if (!authUserId.equals(id)) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN,
						"Access denied: Solo puedes ver tus propios servicios");
			}
		}

		List<OtherService> otherServices = otherServiceService.getOtherServiceByUserId(id);
		List<Venue> venues = venueService.getVenuesByUserId(id);

		List<EventProperties> pendingEventProperties = new ArrayList<>();

		pendingEventProperties.addAll(
				otherServices.stream()
						.flatMap(o -> eventPropertiesService.findEventPropertiesByOtherService(o.getId()).stream())
						.filter(ep -> ep.getStatus() == EventProperties.Status.PENDING)
						.collect(Collectors.toList()));

		pendingEventProperties.addAll(
				venues.stream()
						.flatMap(v -> eventPropertiesService.findEventPropertiesByVenue(v.getId()).stream())
						.filter(ep -> ep.getStatus() == EventProperties.Status.PENDING)
						.collect(Collectors.toList()));

		List<Venue> requestVenues = pendingEventProperties.stream()
				.map(EventProperties::getVenue)
				.filter(Objects::nonNull)
				.distinct()
				.collect(Collectors.toList());

		List<OtherService> requestOtherServices = pendingEventProperties.stream()
				.map(EventProperties::getOtherService)
				.filter(Objects::nonNull)
				.distinct()
				.collect(Collectors.toList());

		return ResponseEntity.ok(new ServiceDTO(requestOtherServices, requestVenues));
	}

}
