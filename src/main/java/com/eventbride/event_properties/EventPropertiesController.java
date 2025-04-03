package com.eventbride.event_properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/event-properties")
public class EventPropertiesController {

    private final UserService userService;
    private final EventService eventService;
    private final EventPropertiesService eventPropertiesService;
    private final OtherServiceService otherServiceService;
    private final VenueService venueService;

    @Autowired
    public EventPropertiesController(EventPropertiesService eventPropertiesService, UserService userService,
            EventService eventService, OtherServiceService otherServiceService, VenueService venueService) {
        this.eventPropertiesService = eventPropertiesService;
        this.userService = userService;
        this.eventService = eventService;
        this.otherServiceService = otherServiceService;
        this.venueService = venueService;
    }

    private Boolean getOwned(Integer id) {
        // DEBEMOS COMPROBAR QUE EL EVENT ASOCIADO ES DEL USUARIO
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Optional<User> user = userService.getUserByUsername(auth.getName());

        if (!user.isPresent()) {
            throw new IllegalArgumentException("El usuario no existe");
        }

        List<Event> ownedEvents = eventService.findEventsByUserId(user.get().getId());
        Boolean owned = ownedEvents.stream()
                .anyMatch(e -> e.getEventProperties().stream().anyMatch(ep -> ep.getId().equals(id)));

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        return !roles.contains("ADMIN") && !owned;
    }

    @GetMapping
    public List<EventProperties> findAllEvents() {
        return eventPropertiesService.findAll();
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateService(@PathVariable Integer id,
            @Valid @RequestBody EventProperties updatedService) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
        if (roles.contains("ADMIN")) {
            try {
                Optional<EventProperties> existingServiceOptional = eventPropertiesService.findByIdOptional(id);
                if (existingServiceOptional.isEmpty()) {
                    return new ResponseEntity<>("Service not found", HttpStatus.NOT_FOUND);
                }
                EventProperties existingService = existingServiceOptional.get();
                existingService.setStartTime(updatedService.getStartTime());
                existingService.setEndTime(updatedService.getEndTime());
                existingService.setStatus(updatedService.getStatus());
                EventProperties savedService = eventPropertiesService.updateEventProperties(existingService, id);
                return new ResponseEntity<>(new EventPropertiesDTO(savedService), HttpStatus.OK);
            } catch (RuntimeException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/DTO/{id}")
    public EventPropertiesDTO findById(@PathVariable("id") Integer id) {
        // Comprobamos que el evento asociado a ese eventPropertie esta asociado al
        // usuario
        if (getOwned(id)) {
            throw new IllegalArgumentException("Este pago no se puede realizar");
        }

        return eventPropertiesService.findByIdDTO(id);
    }

    @GetMapping("/requests/{userId}")
    public List<EventPropertiesDTO> getAllEventPropertiesAfterNow(@PathVariable("userId") Integer userId) {
        return eventPropertiesService.findAllEventPropertiesAfterNow(userId);
    }

    @PutMapping("/{eventId}/add-otherservice/{otherServiceId}")
    public ResponseEntity<?> addOtherServiceToEvent(
            @PathVariable Integer eventId,
            @PathVariable Integer otherServiceId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate) {

        OtherService o = otherServiceService.getAllOtherServices()
                .stream()
                .filter(e -> e.getId().equals(otherServiceId)) // Usar equals() en lugar de ==
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado"));

        if (o.getAvailable()) {
            Event updatedEvent = eventPropertiesService.addOtherServiceToEvent(eventId, otherServiceId, startDate,
                    endDate);
            return ResponseEntity.ok(updatedEvent);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No puedes deshabilitar servicios asociados a eventos"));
        }
    }

    @PutMapping("/{eventId}/add-venue/{venueId}")
    public ResponseEntity<?> addVenueToEvent(
            @PathVariable Integer eventId,
            @PathVariable Integer venueId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate) {

        Venue venue = venueService.getAllVenues()
                .stream()
                .filter(v -> v.getId().equals(venueId)) // Usar equals() para comparar Integer
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venue no encontrado"));

        if (!venue.getAvailable()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "No puedes asignar un venue deshabilitado a un evento"));
        }

        Event updatedEvent = eventPropertiesService.addVenueToEvent(eventId, venueId, startDate, endDate);
        return ResponseEntity.ok(updatedEvent);
    }

    @PutMapping("/cancel/{eventPropertieID}")
    public ResponseEntity<Void> cancelEvent(@PathVariable Integer eventPropertieID, @RequestBody User user) {
        EventProperties evenProp = eventPropertiesService.findById(eventPropertieID);
        LocalDate fechaEvento = evenProp.getStartTime().toLocalDate();
        if (evenProp.getVenue() != null) {
            eventPropertiesService.getEventsPropsToCancelVenue(fechaEvento, evenProp.getVenue().getId(),
                    evenProp.getId());
        } else {
            eventPropertiesService.getEventsPropsToCancelOtherService(fechaEvento, evenProp.getOtherService().getId(),
                    evenProp.getId());
        }

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{eventPropertiesId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<EventProperties> acceptService(@PathVariable("eventPropertiesId") Integer eventPropertiesId) {
        EventProperties updateEventProperties = eventPropertiesService.findById(eventPropertiesId);
        if (updateEventProperties == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            updateEventProperties.setStatus(EventProperties.Status.APPROVED);
            return new ResponseEntity<>(
                    this.eventPropertiesService.updateEventProperties(updateEventProperties, eventPropertiesId),
                    HttpStatus.OK);
        }
    }

    @DeleteMapping("/{eventPropertiesId}")
    @ResponseStatus(HttpStatus.CREATED)
    public void rejectService(@PathVariable("eventPropertiesId") Integer eventPropertiesId) {
        EventProperties eventProperties = eventPropertiesService.findById(eventPropertiesId);
        if (eventProperties != null) {
            eventProperties.setOtherService(null);
            eventProperties.setVenue(null);
            EventProperties eventPropertiesSaved = eventPropertiesService.save(eventProperties);
            eventPropertiesService.deleteEventProperties(eventPropertiesSaved.getId());
        }
    }

    @GetMapping("/pending/{userId}")
    public List<EventPropertiesDTO> getPendingEventPropertiesByUserId(@PathVariable("userId") Integer userId) {
        return eventPropertiesService.findEventPropertiesPendingByUserId(userId);
    }

    @PutMapping("/status/pending/{eventPropertiesId}")
    public ResponseEntity<EventProperties> updateStatusPending(
            @PathVariable("eventPropertiesId") Integer eventPropertiesId) {
        EventProperties eventProperties = eventPropertiesService.findById(eventPropertiesId);
        if (eventProperties != null) {
            eventProperties.setStatus(EventProperties.Status.PENDING);
            return new ResponseEntity<>(eventPropertiesService.save(eventProperties), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
