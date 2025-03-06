package com.eventbride.event;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.event_properties.EventProperties;
import com.eventbride.invitation.Invitation;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    @Autowired
    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }

    @GetMapping
    public List<Event> findAllEvents() {
        return eventService.findAll();
    }

    @GetMapping("/{id}")
    public Event findById(@PathVariable("id") Integer id) {
        return eventService.findById(id);
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Event> create(@RequestBody @Valid Event event) {
        Event newEvent = new Event();
        BeanUtils.copyProperties(event, newEvent, "id");
        List<Invitation> invitations = new ArrayList<>();
        List<EventProperties> eventProperties = new ArrayList<>();
        newEvent.setEventType(event.getEventType());
        newEvent.setGuests(event.getGuests());
        newEvent.setBudget(event.getBudget());
        newEvent.setEventDate(event.getEventDate());
        newEvent.setUser(event.getUser());
        newEvent.setInvitations(invitations);
        newEvent.setEventProperties(eventProperties);
        Event savedEvent;
        savedEvent = this.eventService.save(newEvent);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Event> update(@PathVariable("eventId") Integer eventId, @RequestBody @Valid Event event) {
        Event updateEvent = eventService.findById(eventId);
        if(updateEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            updateEvent.setEventType(event.getEventType());
            updateEvent.setGuests(event.getGuests());
            updateEvent.setBudget(event.getBudget());
            updateEvent.setEventDate(event.getEventDate());
            updateEvent.setUser(event.getUser());
            updateEvent.setInvitations(event.getInvitations());
            updateEvent.setEventProperties(event.getEventProperties());
            return new ResponseEntity<>(this.eventService.updateEvent(updateEvent, eventId), HttpStatus.OK);
        }
    }
  
	@DeleteMapping("/{eventId}")
	@ResponseStatus(HttpStatus.OK)
	public void delete(@PathVariable("eventId") int eventId) {
        if(eventService.findById(eventId) != null) {
            Event event = eventService.findById(eventId);
            User user = event.getUser();
        if (user != null) {
            user.getEvents().remove(event);
            userService.save(user);  
        }
        event.getEventProperties().clear(); // Comprobar si hace falta, creo que no
        eventService.save(event);
        eventService.deleteEvent(eventId);
        }
  }
  
}