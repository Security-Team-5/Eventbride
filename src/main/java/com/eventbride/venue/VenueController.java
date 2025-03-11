package com.eventbride.venue;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

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

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();

		ex.getBindingResult().getFieldErrors().forEach(error -> {
			errors.put(error.getField(), error.getDefaultMessage());
		});

		return ResponseEntity.badRequest().body(errors);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleJsonParseError(HttpMessageNotReadableException ex) {
		Map<String, String> errorDetails = new HashMap<>();

		Throwable cause = ex.getCause();
		if (cause instanceof JsonMappingException jsonMappingException) {
			for (JsonMappingException.Reference reference : jsonMappingException.getPath()) {
				String fieldName = reference.getFieldName();
				errorDetails.put(fieldName, "El campo '" + fieldName + "' tiene un formato incorrecto o un valor no válido.");
			}
			errorDetails.put("error", "El formato del JSON es incorrecto o faltan datos obligatorios.");
		} else if (cause instanceof JsonParseException) {
			errorDetails.put("error", "Error de sintaxis en el JSON. Verifica la estructura.");
		} else {
			errorDetails.put("error", "El formato del JSON es incorrecto o faltan datos obligatorios.");
		}

		return ResponseEntity.badRequest().body(errorDetails);
	}

	@PutMapping("/admin/{id}")
	public ResponseEntity<?> updateVenue(@PathVariable Integer id, @Valid @RequestBody Venue venueDetails) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
		if (roles.contains("ADMIN")) {
			try {
				Venue updatedVenue = venueService.updateVenue(id, venueDetails);
				return new ResponseEntity<>(new VenueDTO(updatedVenue), HttpStatus.OK);
			} catch (RuntimeException e) {
				return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
			}
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@DeleteMapping("/admin/{id}")
	public ResponseEntity<?> deleteService(@PathVariable Integer id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
		if(roles.contains("ADMIN")) {
			venueService.deleteVenue(id);
			return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

}
