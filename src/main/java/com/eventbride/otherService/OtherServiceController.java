package com.eventbride.otherService;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.eventbride.dto.OtherServiceDTO;
import com.eventbride.event_properties.EventPropertiesService;
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
import org.springframework.web.server.ResponseStatusException;
import com.eventbride.otherService.OtherService.OtherServiceType;
import com.eventbride.venue.Venue;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/other-services")
public class OtherServiceController {

	@Autowired
	private OtherServiceService otherServiceService;

	@Autowired
	private EventPropertiesService eventPropertiesService;

	@GetMapping
	public List<OtherServiceDTO> getAllOtherServices() {
		List<OtherService> otherServices = otherServiceService.getAllOtherServices().stream()
				.filter(s -> s.getAvailable() == true).toList();
		return OtherServiceDTO.fromEntities(otherServices);
	}

	@GetMapping("/{id}")
	public OtherService getOtherServiceById(@PathVariable("id") Integer id) {
		Optional<OtherService> otherSer = otherServiceService.getOtherServiceById(id);
		return otherSer.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
	}

	@GetMapping("/filter")
	public List<OtherServiceDTO> getFilteredOtherServices(
			@RequestParam(required = false) String name,
			@RequestParam(required = false) String city,
			@RequestParam(required = false) OtherServiceType type) {
		List<OtherService> otherServices = otherServiceService.getFilteredOtherServices(name, city, type);
		return OtherServiceDTO.fromEntities(otherServices);
	}

	@PostMapping
	public ResponseEntity<?> createOtherService(@Valid @RequestBody OtherService otherService) {
		try {
			OtherService newOtherService = otherServiceService.createOtherService(otherService);
			return ResponseEntity.ok(new OtherServiceDTO(newOtherService));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteOtherService(@PathVariable Integer id) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

		System.out.println("Authorities: " + authorities);

		boolean hasSupplierRole = authorities.stream()
				.map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("SUPPLIER") || role.equals("ROLE_SUPPLIER"));

		if (hasSupplierRole) {
			otherServiceService.deleteOtherService(id);
			return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
		}

		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
				errorDetails.put(fieldName,
						"El campo '" + fieldName + "' tiene un formato incorrecto o un valor no válido.");
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
	public ResponseEntity<?> updateService(@PathVariable Integer id, @Valid @RequestBody OtherService updatedService) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
		if (roles.contains("ADMIN")) {
			try {
				Optional<OtherService> existingServiceOptional = otherServiceService.getOtherServiceById(id);
				if (existingServiceOptional.isEmpty()) {
					return new ResponseEntity<>("Service not found", HttpStatus.NOT_FOUND);
				}
				updatedService.setId(id);
				OtherService savedService = otherServiceService.updateOtherService(id, updatedService);
				return new ResponseEntity<>(new OtherServiceDTO(savedService), HttpStatus.OK);
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
		if (roles.contains("ADMIN")) {
			otherServiceService.deleteOtherService(id);
			return new ResponseEntity<>("Deleted successfully", HttpStatus.OK);
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@PatchMapping("/disable/{id}")
	public ResponseEntity<?> toggleOtherServiceAvailability(@PathVariable Integer id) {
		Optional<OtherService> optionalService = otherServiceService.getOtherServiceById(id);

		if (optionalService.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("error", "Servicio no encontrado"));
		}

		OtherService service = optionalService.get();

		// Asegurarse que no se puede hacer disable si existen eventos asociados al
		// servicio
		Boolean otherServices = eventPropertiesService.findAll().stream().filter(e -> e.getOtherService() != null)
				.anyMatch(e -> e.getOtherService().getId() == service.getId());

		if (!otherServices) {
			service.setAvailable(!service.getAvailable());
			otherServiceService.save(service);
			return ResponseEntity.ok(Map.of("available", service.getAvailable()));
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("error", "No puedes deshabilitar servicios asociados a eventos"));
		}

	}

}
