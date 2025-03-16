package com.eventbride.event_properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.event.Event;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

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

    @GetMapping("/{id}")
    public EventProperties findById(@PathVariable("id") Integer id) {
        return eventPropertiesService.findById(id);
    }

    @PutMapping("/{eventId}/add-otherservice/{otherServiceId}")
    public ResponseEntity<Event> addOtherServiceToEvent(@PathVariable Integer eventId, @PathVariable Integer otherServiceId,         
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate) {
        Event updatedEvent = eventPropertiesService.addOtherServiceToEvent(eventId, otherServiceId, startDate, endDate);
        return ResponseEntity.ok(updatedEvent);
    }

    @PutMapping("/{eventId}/add-venue/{venueId}")
    public ResponseEntity<Event> addVenueToEvent(@PathVariable Integer eventId, @PathVariable Integer venueId, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDate, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDate) {
        Event updatedEvent = eventPropertiesService.addVenueToEvent(eventId, venueId, startDate, endDate);
        return ResponseEntity.ok(updatedEvent);
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

}
