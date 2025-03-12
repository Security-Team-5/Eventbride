package com.eventbride.venue;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.converter.HttpMessageNotReadableException;
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

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Integer id) {
        return venueService.getVenueById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Integer id, @Valid @RequestBody Venue venue) {
        try {
            Venue updatedVenue = venueService.update(id, venue);
            return ResponseEntity.ok(updatedVenue);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
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

}
