package com.eventbride.event;

import com.eventbride.model.MessageResponse;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.dto.EventDTO;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesService;
import com.eventbride.invitation.Invitation;
import com.eventbride.invitation.InvitationService;

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
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;
    private final EventPropertiesService eventPropertiesService;
    private final InvitationService invitationService;
	private final UserService userService;

    @Autowired
    public EventController(EventService eventService,
            EventPropertiesService eventPropertiesService, InvitationService invitationService, UserService userService) {
        this.eventService = eventService;
        this.eventPropertiesService = eventPropertiesService;
        this.invitationService = invitationService;
		this.userService = userService;
    }

    @GetMapping
    public List<Event> findAllEvents() {
        return eventService.findAll();
    }

    @GetMapping("/DTO")
    public ResponseEntity<?> findAllEventsDTO() {
        try {
            List<EventDTO> events = eventService.getAllEventsDTO();
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public EventDTO findById(@PathVariable("id") Integer id) throws IllegalArgumentException, DataAccessException {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Optional<User> user = userService.getUserByUsername(auth.getName());

		Event event = eventService.findById(id);

		if (!user.isPresent()) {
			throw new IllegalArgumentException("El usuario no existe");
		}

		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
		List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

		if (!roles.contains("ADMIN") && !event.getUser().getId().equals(user.get().getId())) {
			throw new IllegalArgumentException("El evento no te pertenece");
		}

        return new EventDTO(eventService.findById(id));
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
        newEvent.setEventDate(event.getEventDate());
        newEvent.setUser(event.getUser());
        newEvent.setEventProperties(eventProperties);
        Event savedEvent;
        savedEvent = this.eventService.save(newEvent);
        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> update(@PathVariable("eventId") Integer eventId, @RequestBody @Valid Event event) {
        try {
            Event updateEvent = eventService.findById(eventId);
            if (updateEvent == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                updateEvent.setEventType(event.getEventType());
                updateEvent.setGuests(event.getGuests());
                updateEvent.setEventDate(event.getEventDate());

                Event e = this.eventService.updateEvent(updateEvent, eventId);
                return new ResponseEntity<>(new EventDTO(e), HttpStatus.OK);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }

    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> delete(@PathVariable("eventId") int eventId) throws  IllegalArgumentException {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Optional<User> user = userService.getUserByUsername(auth.getName());

		if (!user.isPresent()) {
			throw new IllegalArgumentException("El usuario no existe");
		}

        if (eventService.findById(eventId) != null) {
            Event event = eventService.findById(eventId);

            event.getEventProperties().clear();

            // Poner a null todas las propiedades del eventProperties asociado a Event
            List<EventProperties> eventProperties = event.getEventProperties();
            for (EventProperties e : eventProperties) {
                e.setOtherService(null);
                e.setVenue(null);
                eventPropertiesService.save(e);
            }

            List<Invitation> i = invitationService.getInvitationByEventId(eventId, user.get());
            if (i.size() > 0) {
                invitationService.deleteInvitations(i);
            }
            eventService.save(event);
            eventService.deleteEvent(eventId);
			return new ResponseEntity<>(new MessageResponse("El evento se ha eliminado correctamente"), HttpStatus.OK);
        }
		else{
			throw new IllegalArgumentException("El evento no existe");
		}
    }

    /*
     * public ResponseEntity<EventDTO> getNextEvent(@PathVariable Integer userId) {
     * Event nextEvent = eventService.getRecentEventByUserId(userId)
     * .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
     * "Evento no encontrado"));
     * return ResponseEntity.ok(new EventDTO(nextEvent));
     * }
     */

    @GetMapping("/next/{userId}")
    public ResponseEntity<List<EventDTO>> getEventsByUserId(@PathVariable Integer userId) {
        List<Event> events = eventService.findEventsByUserId(userId);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<EventDTO> eventDTOs = new ArrayList<>();
        for (Event event : events) {
            eventDTOs.add(new EventDTO(event));
        }
        return new ResponseEntity<>(eventDTOs, HttpStatus.OK);
    }

    @GetMapping("/next/{userId}/without/{serviceId}")
    public ResponseEntity<List<EventDTO>> getEventsByUserIdWithoutAService(@PathVariable Integer userId, @PathVariable Integer serviceId) {
        List<Event> events = eventService.findEventsByUserIdWithoutAService(userId, serviceId);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<EventDTO> eventDTOs = new ArrayList<>();
        for (Event event : events) {
            eventDTOs.add(new EventDTO(event));
        }
        return new ResponseEntity<>(eventDTOs, HttpStatus.OK);
    }
}
