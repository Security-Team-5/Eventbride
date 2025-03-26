package com.eventbride.event_properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.event.Event;
import com.eventbride.user.User;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/event-properties")
public class EventPropertiesController {

    private final EventPropertiesService eventPropertiesService;

    @Autowired
    public EventPropertiesController(EventPropertiesService eventPropertiesService) {
        this.eventPropertiesService = eventPropertiesService;
    }

    @GetMapping
    public List<EventProperties> findAllEvents() {
        return eventPropertiesService.findAll();
    }

    @GetMapping("/DTO/{id}")
    public EventPropertiesDTO findById(@PathVariable("id") Integer id) {
        return eventPropertiesService.findByIdDTO(id);
    }

    @GetMapping("/byevent/{eventId}/{userId}")
    public EventProperties findEventPropertiesByEventAndUser(@PathVariable("userId") Integer userId, @PathVariable("eventId") Integer eventId) {
        return eventPropertiesService.findEventPropertiesByEventAndUser(userId, eventId);
    }

    @PutMapping("/{eventId}/add-otherservice/{otherServiceId}")
    public ResponseEntity<Event> addOtherServiceToEvent(@PathVariable Integer eventId,
            @PathVariable Integer otherServiceId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate) {
        Event updatedEvent = eventPropertiesService.addOtherServiceToEvent(eventId, otherServiceId, startDate, endDate);
        return ResponseEntity.ok(updatedEvent);
    }

    @PutMapping("/{eventId}/add-venue/{venueId}")
    public ResponseEntity<Event> addVenueToEvent(@PathVariable Integer eventId, @PathVariable Integer venueId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate) {
        Event updatedEvent = eventPropertiesService.addVenueToEvent(eventId, venueId, startDate, endDate);
        return ResponseEntity.ok(updatedEvent);
    }

    @PutMapping("/cancel/{eventPropertieID}")
    public ResponseEntity<Void> cancelEvent(@PathVariable Integer eventPropertieID) {
        EventProperties evenProp = eventPropertiesService.findById(eventPropertieID) ;
        LocalDate fechaEvento = evenProp.getStartTime().toLocalDate();
        if(evenProp.getVenue() != null){
            eventPropertiesService.getEventsPropsToCancelVenue(fechaEvento, evenProp.getVenue().getId(), evenProp.getId());
        }else{
            eventPropertiesService.getEventsPropsToCancelOtherService(fechaEvento, evenProp.getOtherService().getId(), evenProp.getId());
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
    public ResponseEntity<EventProperties> updateStatusPending(@PathVariable("eventPropertiesId") Integer eventPropertiesId) {
        EventProperties eventProperties = eventPropertiesService.findById(eventPropertiesId);
        if (eventProperties != null) {
            eventProperties.setStatus(EventProperties.Status.PENDING);
            return new ResponseEntity<>(eventPropertiesService.save(eventProperties), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
