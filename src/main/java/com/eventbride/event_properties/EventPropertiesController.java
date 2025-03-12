package com.eventbride.event_properties;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
        newEventProperties.setApproved(eventProperties.getApproved());
        newEventProperties.setRequestDate(eventProperties.getRequestDate());
        EventProperties savedEventProperties;
        savedEventProperties = this.eventPropertiesService.save(newEventProperties);
        return new ResponseEntity<>(savedEventProperties, HttpStatus.CREATED);
    }

    @PutMapping("/{eventPropertiesId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<EventProperties> update(@PathVariable("eventPropertiesId") Integer eventPropertiesId, @RequestBody @Valid EventProperties eventProperties) {
        EventProperties updateEventProperties = eventPropertiesService.findById(eventPropertiesId);
        if(updateEventProperties == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            updateEventProperties.setOtherService(eventProperties.getOtherService());
            updateEventProperties.setVenue(eventProperties.getVenue());
            updateEventProperties.setApproved(eventProperties.getApproved());
            updateEventProperties.setRequestDate(eventProperties.getRequestDate());
            return new ResponseEntity<>(this.eventPropertiesService.updateEventProperties(updateEventProperties, eventPropertiesId), HttpStatus.OK);
        }
    }

}
