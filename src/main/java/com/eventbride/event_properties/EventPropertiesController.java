package com.eventbride.event_properties;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.event.Event;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/v1/eventProperties")
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

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<EventProperties> create(@RequestBody @Valid EventProperties eventProperties) {
        EventProperties newEventProperties = new EventProperties();
        BeanUtils.copyProperties(eventProperties, newEventProperties, "id");
        newEventProperties.setOtherService(eventProperties.getOtherService());
        newEventProperties.setVenue(eventProperties.getVenue());
        EventProperties savedEventProperties;
        savedEventProperties = this.eventPropertiesService.save(newEventProperties);
        return new ResponseEntity<>(savedEventProperties, HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}/add-otherservice/{otherServiceId}")
    public ResponseEntity<Event> addOtherServiceToEvent(@PathVariable Integer eventId, @PathVariable Integer otherServiceId) {
        Event updatedEvent = eventPropertiesService.addOtherServiceToEvent(eventId, otherServiceId);
        return ResponseEntity.ok(updatedEvent);
    }
    

    @PostMapping("/{eventId}/add-otherservice-hours")
    public ResponseEntity<String> addOtherServiceToEventWithHours(@PathVariable Integer eventId, @PathVariable Integer otherServiceId, @PathVariable Integer hours) {
        eventPropertiesService.addOtherServiceToEventWithHours(eventId, otherServiceId, hours);
        return ResponseEntity.ok("Servicio añadido al evento correctamente");
    }

    @PostMapping("/{eventId}/add-venue")
    public ResponseEntity<String> addVenueToEvent(@PathVariable Integer eventId, @PathVariable Integer venueId, @PathVariable Integer hours) {
        eventPropertiesService.addVenueToEvent(eventId, venueId, hours);
        return ResponseEntity.ok("Servicio añadido al evento correctamente");
    }

    @PutMapping("/{eventPropertiesId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<EventProperties> update(@PathVariable("eventPropertiesId") Integer eventPropertiesId,
            @RequestBody @Valid EventProperties eventProperties) {
        EventProperties updateEventProperties = eventPropertiesService.findById(eventPropertiesId);
        if (updateEventProperties == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            updateEventProperties.setOtherService(eventProperties.getOtherService());
            updateEventProperties.setVenue(eventProperties.getVenue());
            return new ResponseEntity<>(
                    this.eventPropertiesService.updateEventProperties(updateEventProperties, eventPropertiesId),
                    HttpStatus.OK);
        }
    }

}
