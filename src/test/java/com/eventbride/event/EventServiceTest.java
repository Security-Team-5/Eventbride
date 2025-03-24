package com.eventbride.event;

import com.eventbride.event.Event.EventType;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.invitation.Invitation;
import com.eventbride.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class EventServiceTest {

    private EventRepository eventRepository;
    private EventService eventService;

    @BeforeEach
    public void setUp() {
        eventRepository = mock(EventRepository.class);
        eventService = new EventService(eventRepository);
    }

    @Test
    public void testFindAll_PositiveCase() {
        Event event = new Event();
        event.setEventType(EventType.WEDDING);
        event.setGuests(100);
        event.setBudget(new BigDecimal("15000.00"));
        event.setEventDate(LocalDate.of(2025, 12, 20));
        event.setUser(new User());
        event.setInvitations(Collections.singletonList(new Invitation()));
        event.setEventProperties(Collections.singletonList(new EventProperties()));
        event.setConfirmedGuests(90);
        event.setPaid(true);

        when(eventRepository.findAll()).thenReturn(Arrays.asList(event));

        List<Event> events = eventService.findAll();

        assertNotNull(events);
        assertEquals(1, events.size());
        assertEquals(EventType.WEDDING, events.get(0).getEventType());
    }

    @Test
    public void testFindAll_NegativeCase_ExceptionThrown() {
        when(eventRepository.findAll()).thenThrow(new DataAccessException("DB error") {});

        DataAccessException exception = assertThrows(DataAccessException.class, () -> {
            eventService.findAll();
        });

        assertEquals("DB error", exception.getMessage());
    }

    @Test
    public void testFindById_PositiveCase() {
        int eventId = 1;
        Event event = new Event();
        event.setId(eventId);
        event.setEventType(EventType.CHRISTENING);
        event.setGuests(80);
        event.setBudget(new BigDecimal("8000.00"));
        event.setEventDate(LocalDate.of(2025, 10, 15));
        event.setUser(new User());
        event.setInvitations(Collections.singletonList(new Invitation()));
        event.setEventProperties(Collections.singletonList(new EventProperties()));
        event.setConfirmedGuests(70);
        event.setPaid(true);

        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.of(event));

        Event result = eventService.findById(eventId);

        assertNotNull(result);
        assertEquals(eventId, result.getId());
        assertEquals(EventType.CHRISTENING, result.getEventType());
    }

    @Test
    public void testFindById_NegativeCase_EventNotFound() {
        int eventId = 999;
        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.empty());

        assertThrows(java.util.NoSuchElementException.class, () -> {
            eventService.findById(eventId);
        });
    }

    @Test
    public void testSave_PositiveCase() {
        Event event = new Event();
        event.setEventType(EventType.COMMUNION);
        event.setGuests(60);
        event.setBudget(new BigDecimal("6000.00"));
        event.setEventDate(LocalDate.of(2025, 8, 12));
        event.setUser(new User());
        event.setInvitations(Collections.singletonList(new Invitation()));
        event.setEventProperties(Collections.singletonList(new EventProperties()));
        event.setConfirmedGuests(50);
        event.setPaid(false);

        when(eventRepository.save(event)).thenReturn(event);

        Event savedEvent = eventService.save(event);

        assertNotNull(savedEvent);
        assertEquals(EventType.COMMUNION, savedEvent.getEventType());
        assertEquals(60, savedEvent.getGuests());
    }

    @Test
    public void testSave_NegativeCase_ExceptionThrown() {
        Event event = new Event();
        event.setEventType(EventType.CHRISTENING);
        event.setGuests(40);
        event.setBudget(new BigDecimal("4000.00"));
        event.setEventDate(LocalDate.of(2025, 7, 5));
        event.setUser(new User());

        when(eventRepository.save(event)).thenThrow(new DataAccessException("Save failed") {});

        DataAccessException exception = assertThrows(DataAccessException.class, () -> {
            eventService.save(event);
        });

        assertEquals("Save failed", exception.getMessage());
    }

    @Test
    public void testUpdateEvent_PositiveCase() {
        int eventId = 1;

        Event existingEvent = new Event();
        existingEvent.setId(eventId);
        existingEvent.setEventType(EventType.WEDDING);
        existingEvent.setGuests(100);
        existingEvent.setBudget(new BigDecimal("10000.00"));
        existingEvent.setEventDate(LocalDate.of(2025, 6, 15));
        existingEvent.setPaid(false);

        Event updatedEvent = new Event();
        updatedEvent.setEventType(EventType.CHRISTENING);
        updatedEvent.setGuests(120);
        updatedEvent.setBudget(new BigDecimal("12000.00"));
        updatedEvent.setEventDate(LocalDate.of(2025, 8, 20));
        updatedEvent.setPaid(true);

        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.of(existingEvent));
        when(eventRepository.save(any(Event.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Event result = eventService.updateEvent(updatedEvent, eventId);

        assertNotNull(result);
        assertEquals(EventType.CHRISTENING, result.getEventType());
        assertEquals(120, result.getGuests());
        assertEquals(new BigDecimal("12000.00"), result.getBudget());
        assertEquals(LocalDate.of(2025, 8, 20), result.getEventDate());
        assertTrue(result.getPaid());
    }

    @Test
    public void testUpdateEvent_NegativeCase_EventNotFound() {
        int eventId = 999;

        Event updatedEvent = new Event();
        updatedEvent.setEventType(EventType.CHRISTENING);
        updatedEvent.setGuests(50);
        updatedEvent.setBudget(new BigDecimal("5000.00"));
        updatedEvent.setEventDate(LocalDate.of(2025, 9, 10));

        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.empty());

        assertThrows(java.util.NoSuchElementException.class, () -> {
            eventService.updateEvent(updatedEvent, eventId);
        });
    }
}
