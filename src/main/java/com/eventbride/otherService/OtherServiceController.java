package com.eventbride.otherService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.eventbride.dto.OtherServiceDTO;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.eventbride.otherService.OtherService.OtherServiceType;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/other-services")
public class OtherServiceController {

    @Autowired
    private OtherServiceService otherServiceService;

@GetMapping
    public List<OtherServiceDTO> getAllOtherServices() {
        List<OtherService> otherServices = otherServiceService.getAllOtherServices();
        return OtherServiceDTO.fromEntities(otherServices);
    }
	
@GetMapping("/{id}")
    public OtherService getOtherServiceById(@PathVariable("id") Integer id) {
		Optional<OtherService> otherSer = otherServiceService.getOtherServiceById(id);
		// return otherSer.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found"));
		return otherSer != null ? otherSer.get() : null;
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


