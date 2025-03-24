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
import java.util.NoSuchElementException;
import java.util.Optional;

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

    @Test
    public void testDeleteEvent_PositiveCase() {
        int eventId = 1;
        Event event = new Event();
        event.setId(eventId);
        event.setEventType(EventType.WEDDING);
        event.setGuests(100);
        event.setBudget(new BigDecimal("10000.00"));

        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.of(event));
        doNothing().when(eventRepository).delete(event);

        assertDoesNotThrow(() -> {
            eventService.deleteEvent(eventId);
        });

        verify(eventRepository, times(1)).delete(event);
    }

    @Test
    public void testDeleteEvent_NegativeCase_EventNotFound() {
        int eventId = 999;
        when(eventRepository.findById(eventId)).thenReturn(java.util.Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            eventService.deleteEvent(eventId);
        });

        verify(eventRepository, never()).delete(any(Event.class));
    }

    @Test
    public void testGetRecentEventByUserId_PositiveCase() {
        Integer userId = 1;
        Event recentEvent = new Event();
        recentEvent.setId(1);
        recentEvent.setUser(new User());
        recentEvent.setEventDate(LocalDate.now());

        when(eventRepository.findRecentEventByUserId(userId)).thenReturn(Optional.of(recentEvent));

        Optional<Event> result = eventService.getRecentEventByUserId(userId);

        assertTrue(result.isPresent());
        assertEquals(recentEvent.getId(), result.get().getId());
    }

    @Test
    public void testGetRecentEventByUserId_NegativeCase_EmptyResult() {
        Integer userId = 99;
        when(eventRepository.findRecentEventByUserId(userId)).thenReturn(Optional.empty());

        Optional<Event> result = eventService.getRecentEventByUserId(userId);

        assertFalse(result.isPresent());
    }

    @Test
    public void testFindEventsByUserId_PositiveCase() {
        Integer userId = 1;
        Event event1 = new Event();
        event1.setId(1);
        event1.setUser(new User());
        event1.setEventType(EventType.WEDDING);

        Event event2 = new Event();
        event2.setId(2);
        event2.setUser(new User());
        event2.setEventType(EventType.CHRISTENING);

        when(eventRepository.findAllEventsByUserId(userId)).thenReturn(Arrays.asList(event1, event2));

        List<Event> result = eventService.findEventsByUserId(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(EventType.WEDDING, result.get(0).getEventType());
    }

    @Test
    public void testFindEventsByUserId_NegativeCase_RepositoryException() {
        Integer userId = 99;
        when(eventRepository.findAllEventsByUserId(userId)).thenThrow(new DataAccessException("Query failed") {});

        DataAccessException exception = assertThrows(DataAccessException.class, () -> {
            eventService.findEventsByUserId(userId);
        });

        assertEquals("Query failed", exception.getMessage());
    }

    @Test
    public void testSaveAll_PositiveCase() {
        Event event1 = new Event();
        event1.setId(1);
        event1.setEventType(EventType.WEDDING);
        event1.setGuests(100);
        event1.setBudget(new BigDecimal("15000.00"));

        Event event2 = new Event();
        event2.setId(2);
        event2.setEventType(EventType.COMMUNION);
        event2.setGuests(30);
        event2.setBudget(new BigDecimal("3000.00"));

        List<Event> events = Arrays.asList(event1, event2);

        eventService.saveAll(events);

        verify(eventRepository, times(1)).saveAll(events);
    }

    @Test
    public void testSaveAll_NegativeCase_ExceptionThrown() {
        Event event = new Event();
        event.setEventType(EventType.COMMUNION);
        event.setGuests(60);
        event.setBudget(new BigDecimal("6000.00"));

        List<Event> events = Collections.singletonList(event);

        doThrow(new DataAccessException("Batch save failed") {}).when(eventRepository).saveAll(events);

        DataAccessException exception = assertThrows(DataAccessException.class, () -> {
            eventService.saveAll(events);
        });

        assertEquals("Batch save failed", exception.getMessage());
    }
}
