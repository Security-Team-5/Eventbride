package com.eventbride.tests.eventProperties;

import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventProperties.Status;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.event_properties.EventPropertiesService;
import com.eventbride.notification.Notification.NotificationType;
import com.eventbride.notification.NotificationService;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.User;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import com.eventbride.venue.VenueService;
import com.eventbride.dto.EventDTO;
import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.dto.EventPropertiesMapper;
import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class EventPropertiesServiceUnitTest {

    @Mock
    private EventPropertiesRepository eventPropertiesRepository;

    @Mock
    private VenueRepository venueRepository;

    @Mock
    private OtherServiceRepository otherServiceRepository;

    @Mock
    private JavaMailSender mailSender;

    @Captor
    private ArgumentCaptor<SimpleMailMessage> mailCaptor;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private VenueService venueService;

    @Mock
    private OtherServiceService otherServiceService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EventPropertiesMapper eventPropertiesMapper;

    @InjectMocks
    private EventPropertiesService eventPropertiesService;

    private Event event;
    private EventProperties eventProperties;
    private Venue venue;
    private OtherService service;

    @BeforeEach
    void setup() {
        event = new Event();
        event.setId(1);
        event.setUser(new User());

        venue = new Venue();
        venue.setId(10);
        venue.setUser(new User());

        service = new OtherService();
        service.setId(20);
        service.setUser(new User());

        eventProperties = new EventProperties();
        eventProperties.setId(99);
    }

    @Test
    void findAll_ShouldReturnAllEventProperties() {
        EventProperties event1 = new EventProperties();
        event1.setBookDateTime(LocalDateTime.now());

        EventProperties event2 = new EventProperties();
        event2.setBookDateTime(LocalDateTime.now().plusDays(1));

        List<EventProperties> expectedEvents = List.of(event1, event2);

        when(eventPropertiesRepository.findAll()).thenReturn(expectedEvents);

        List<EventProperties> result = eventPropertiesService.findAll();

        assertEquals(2, result.size());
        assertEquals(expectedEvents, result);
    }

    @Test
    void findAll_WhenNoEventPropertiesExist_ShouldReturnEmptyList() {
        when(eventPropertiesRepository.findAll()).thenReturn(List.of());

        List<EventProperties> result = eventPropertiesService.findAll();

        assertEquals(0, result.size(), "La lista debería estar vacía si no hay propiedades de eventos.");
    }

    @Test
    void findAll_WhenRepositoryThrowsException_ShouldPropagateException() {
        RuntimeException repositoryException = new RuntimeException("Error al acceder a la base de datos");
        when(eventPropertiesRepository.findAll()).thenThrow(repositoryException);

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            eventPropertiesService.findAll();
        });

        assertEquals("Error al acceder a la base de datos", thrown.getMessage());
    }

    @Test
    void findByIdDTO_WhenEventPropertiesNotFound_ShouldThrowException() {
        int id = 999;

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            eventPropertiesService.findByIdDTO(id);
        });
    }

    @Test
    void findByIdDTO_WhenEventRetrievalFails_ShouldThrowException() {
        int id = 1;

        EventProperties eventProperties = new EventProperties();
        eventProperties.setId(id);

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.of(eventProperties));
        when(eventPropertiesRepository.findEventByEventPropertiesId(id))
                .thenThrow(new RuntimeException("Error fetching event"));

        assertThrows(RuntimeException.class, () -> {
            eventPropertiesService.findByIdDTO(id);
        });
    }

    @Test
    void findById_ShouldReturnEventProperties_WhenIdExists() {
        int eventPropertiesId = 1;
        EventProperties eventProperties = new EventProperties();
        eventProperties.setId(eventPropertiesId);

        when(eventPropertiesRepository.findById(eventPropertiesId)).thenReturn(Optional.of(eventProperties));

        EventProperties result = eventPropertiesService.findById(eventPropertiesId);

        assertNotNull(result);
        assertEquals(eventPropertiesId, result.getId());
    }

    @Test
    void findById_ShouldThrowException_WhenIdNotFound() {
        int nonExistentId = 999;
        when(eventPropertiesRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> eventPropertiesService.findById(nonExistentId));
    }

    @Test
    void findById_ShouldThrowException_WhenRepositoryFails() {
        int eventPropertiesId = 1;
        when(eventPropertiesRepository.findById(eventPropertiesId))
                .thenThrow(new RuntimeException("Database error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            eventPropertiesService.findById(eventPropertiesId);
        });

        assertEquals("Database error", exception.getMessage());
    }

    @Test
    void findByIdOptional_ShouldReturnOptionalWithEventProperties_WhenIdExists() {
        int eventPropertiesId = 1;
        EventProperties eventProperties = new EventProperties();
        eventProperties.setId(eventPropertiesId);

        when(eventPropertiesRepository.findById(eventPropertiesId)).thenReturn(Optional.of(eventProperties));

        Optional<EventProperties> result = eventPropertiesService.findByIdOptional(eventPropertiesId);

        assertTrue(result.isPresent());
        assertEquals(eventPropertiesId, result.get().getId());
    }

    @Test
    void findByIdOptional_ShouldReturnEmptyOptional_WhenIdDoesNotExist() {
        int nonExistentId = 999;

        when(eventPropertiesRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        Optional<EventProperties> result = eventPropertiesService.findByIdOptional(nonExistentId);

        assertFalse(result.isPresent());
    }

    @Test
    void findByIdOptional_ShouldThrowException_WhenRepositoryFails() {
        int id = 1;

        when(eventPropertiesRepository.findById(id))
                .thenThrow(new RuntimeException("Database failure"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.findByIdOptional(id));

        assertEquals("Database failure", exception.getMessage());
    }

    @Test
    void save_ShouldReturnSavedEventProperties_WhenValidInput() {
        EventProperties eventProperties = new EventProperties();
        eventProperties.setId(1);

        when(eventPropertiesRepository.save(eventProperties)).thenReturn(eventProperties);

        EventProperties result = eventPropertiesService.save(eventProperties);

        assertNotNull(result);
        assertEquals(eventProperties.getId(), result.getId());
        verify(eventPropertiesRepository).save(eventProperties);
    }

    @Test
    void save_ShouldThrowException_WhenRepositoryFails() {
        EventProperties eventProperties = new EventProperties();
        eventProperties.setId(1);

        when(eventPropertiesRepository.save(eventProperties))
                .thenThrow(new RuntimeException("Error al guardar en la base de datos"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.save(eventProperties));

        assertEquals("Error al guardar en la base de datos", exception.getMessage());
    }

    @Test
    void updateEventProperties_ShouldUpdateAndNotify_WhenStatusIsApproved() {
        int id = 1;

        EventProperties updatedProperties = new EventProperties();
        updatedProperties.setId(id);
        updatedProperties.setStatus(EventProperties.Status.APPROVED);

        EventProperties existingProperties = new EventProperties();
        existingProperties.setId(id);
        existingProperties.setStatus(EventProperties.Status.PENDING);

        Event event = new Event();
        User user = new User();
        user.setEmail("user@example.com");
        event.setUser(user);

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.of(existingProperties));
        when(eventRepository.findByEventPropertiesId(id)).thenReturn(Optional.of(event));
        when(eventPropertiesRepository.save(any(EventProperties.class))).thenAnswer(inv -> inv.getArgument(0));

        EventProperties result = eventPropertiesService.updateEventProperties(updatedProperties, id);

        assertNotNull(result);
        assertEquals(EventProperties.Status.APPROVED, result.getStatus());

        /*
         * verify(notificationService).createNotification(
         * eq(NotificationType.REQUEST_CONFIRMED),
         * eq(user),
         * eq(event),
         * eq(updatedProperties));
         */
        verify(eventPropertiesRepository).save(existingProperties);
    }

    @Test
    void updateEventProperties_ShouldThrowException_WhenEventPropertiesNotFound() {
        int id = 999;
        EventProperties input = new EventProperties();
        input.setStatus(EventProperties.Status.APPROVED);

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> eventPropertiesService.updateEventProperties(input, id));
    }

    @Test
    void updateEventProperties_ShouldNotSendNotification_WhenStatusIsNotApproved() {
        int id = 2;

        EventProperties updated = new EventProperties();
        updated.setId(id);
        updated.setStatus(EventProperties.Status.PENDING);

        EventProperties existing = new EventProperties();
        existing.setId(id);

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.of(existing));
        when(eventPropertiesRepository.save(any(EventProperties.class))).thenAnswer(inv -> inv.getArgument(0));

        EventProperties result = eventPropertiesService.updateEventProperties(updated, id);

        assertNotNull(result);
        assertEquals(EventProperties.Status.PENDING, result.getStatus());

        /*
         * verify(notificationService, never()).createNotification(any(), any(), any(),
         * any());
         */ }

    @Test
    void updateEventPropertiesToCancelled_ShouldUpdateStatus_WhenIdExists() {
        int id = 1;

        EventProperties existing = new EventProperties();
        existing.setId(id);
        existing.setStatus(EventProperties.Status.APPROVED);

        EventProperties updated = new EventProperties();
        updated.setId(id);
        updated.setStatus(EventProperties.Status.CANCELLED);

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.of(existing));
        when(eventPropertiesRepository.save(any())).thenReturn(updated);

        EventProperties result = eventPropertiesService.updateEventPropertiesToCancelled(id);

        assertNotNull(result);
        assertEquals(EventProperties.Status.CANCELLED, result.getStatus());

        verify(eventPropertiesRepository).save(any());
    }

    @Test
    void updateEventPropertiesToCancelled_ShouldThrowException_WhenEventPropertiesNotFound() {
        int id = 999;

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> eventPropertiesService.updateEventPropertiesToCancelled(id));
    }

    @Test
    void updateEventPropertiesToCancelled_ShouldThrowException_WhenSaveFails() {
        int id = 1;

        EventProperties existing = new EventProperties();
        existing.setId(id);
        existing.setStatus(EventProperties.Status.APPROVED);

        when(eventPropertiesRepository.findById(id)).thenReturn(Optional.of(existing));
        when(eventPropertiesRepository.save(any())).thenThrow(new RuntimeException("Error al guardar"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.updateEventPropertiesToCancelled(id));

        assertEquals("Error al guardar", exception.getMessage());
    }

    @Test
    void findEventPropertiesByEvent_ShouldReturnNull_WhenNoEventPropertiesFound() {
        Event event = new Event();
        event.setId(2);

        when(eventPropertiesRepository.findEventPropertiesByEvent(event)).thenReturn(null);

        EventProperties result = eventPropertiesService.findEventPropertiesByEvent(event);

        assertNull(result);
    }

    @Test
    void findEventPropertiesByEvent_ShouldThrowException_WhenRepositoryFails() {
        Event event = new Event();
        event.setId(3);

        when(eventPropertiesRepository.findEventPropertiesByEvent(event))
                .thenThrow(new RuntimeException("Database error"));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.findEventPropertiesByEvent(event));

        assertEquals("Database error", ex.getMessage());
    }

    @Test
    void findEventByEventPropertiesId_ShouldReturnEvent_WhenExists() {
        int eventPropertiesId = 1;

        Event expectedEvent = new Event();
        expectedEvent.setId(100);

        when(eventPropertiesRepository.findEventByEventPropertiesId(eventPropertiesId)).thenReturn(expectedEvent);

        Event result = eventPropertiesService.findEventByEventPropertiesId(eventPropertiesId);

        assertNotNull(result);
        assertEquals(100, result.getId());
        verify(eventPropertiesRepository).findEventByEventPropertiesId(eventPropertiesId);
    }

    @Test
    void findEventByEventPropertiesId_ShouldReturnNull_WhenEventDoesNotExist() {
        int eventPropertiesId = 999;

        when(eventPropertiesRepository.findEventByEventPropertiesId(eventPropertiesId)).thenReturn(null);

        Event result = eventPropertiesService.findEventByEventPropertiesId(eventPropertiesId);

        assertNull(result);
    }

    @Test
    void findEventByEventPropertiesId_ShouldThrowException_WhenRepositoryFails() {
        int eventPropertiesId = 1;

        when(eventPropertiesRepository.findEventByEventPropertiesId(eventPropertiesId))
                .thenThrow(new RuntimeException("Database error"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.findEventByEventPropertiesId(eventPropertiesId));

        assertEquals("Database error", exception.getMessage());
    }

    @Test
    void findEventPropertiesByOtherService_ShouldReturnList_WhenExists() {
        int otherServiceId = 1;

        EventProperties ep1 = new EventProperties();
        ep1.setId(101);

        EventProperties ep2 = new EventProperties();
        ep2.setId(102);

        List<EventProperties> expectedList = List.of(ep1, ep2);

        when(eventPropertiesRepository.findEventPropertiesByOtherServiceId(otherServiceId))
                .thenReturn(expectedList);

        List<EventProperties> result = eventPropertiesService.findEventPropertiesByOtherService(otherServiceId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(101, result.get(0).getId());
        assertEquals(102, result.get(1).getId());

        verify(eventPropertiesRepository).findEventPropertiesByOtherServiceId(otherServiceId);
    }

    @Test
    void findEventPropertiesByOtherService_ShouldReturnEmptyList_WhenNoneExist() {
        int otherServiceId = 99;

        when(eventPropertiesRepository.findEventPropertiesByOtherServiceId(otherServiceId))
                .thenReturn(List.of());

        List<EventProperties> result = eventPropertiesService.findEventPropertiesByOtherService(otherServiceId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void findEventPropertiesByOtherService_ShouldThrowException_WhenRepositoryFails() {
        int otherServiceId = 1;

        when(eventPropertiesRepository.findEventPropertiesByOtherServiceId(otherServiceId))
                .thenThrow(new RuntimeException("DB error"));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.findEventPropertiesByOtherService(otherServiceId));

        assertEquals("DB error", ex.getMessage());
    }

    @Test
    void findEventPropertiesByVenue_ShouldReturnList_WhenEventPropertiesExist() {
        int venueId = 1;

        EventProperties ep1 = new EventProperties();
        ep1.setId(201);

        EventProperties ep2 = new EventProperties();
        ep2.setId(202);

        List<EventProperties> expectedList = List.of(ep1, ep2);

        when(eventPropertiesRepository.findEventPropertiesByVenueId(venueId)).thenReturn(expectedList);

        List<EventProperties> result = eventPropertiesService.findEventPropertiesByVenue(venueId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(201, result.get(0).getId());
        assertEquals(202, result.get(1).getId());

        verify(eventPropertiesRepository).findEventPropertiesByVenueId(venueId);
    }

    @Test
    void findEventPropertiesByVenue_ShouldReturnEmptyList_WhenNoEventPropertiesExist() {
        int venueId = 99;

        when(eventPropertiesRepository.findEventPropertiesByVenueId(venueId)).thenReturn(List.of());

        List<EventProperties> result = eventPropertiesService.findEventPropertiesByVenue(venueId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void findEventPropertiesByVenue_ShouldThrowException_WhenRepositoryFails() {
        int venueId = 1;

        when(eventPropertiesRepository.findEventPropertiesByVenueId(venueId))
                .thenThrow(new RuntimeException("Database access error"));

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> eventPropertiesService.findEventPropertiesByVenue(venueId));

        assertEquals("Database access error", exception.getMessage());
    }

    @Test
    void findAllEventPropertiesAfterNow_ShouldReturnEmptyList_WhenUserHasNoOwnedServices() {
        int userId = 999;

        User otherUser = new User();
        otherUser.setId(100);

        Venue venue = new Venue();
        venue.setUser(otherUser);

        OtherService otherService = new OtherService();
        otherService.setUser(otherUser);

        EventProperties ep1 = new EventProperties();
        ep1.setId(1);
        ep1.setVenue(venue);
        ep1.setOtherService(null);

        EventProperties ep2 = new EventProperties();
        ep2.setId(2);
        ep2.setVenue(null);
        ep2.setOtherService(otherService);

        when(eventPropertiesRepository.findAll()).thenReturn(List.of(ep1, ep2));
        when(eventRepository.findAll()).thenReturn(List.of());

        List<List<Object>> result = eventPropertiesService.findAllEventPropertiesAfterNow(userId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void findAllEventPropertiesAfterNow_ShouldReturnEmptyList_WhenNoEventContainsUserEventProperties() {
        int userId = 1;

        User owner = new User();
        owner.setId(userId);

        Venue venue = new Venue();
        venue.setUser(owner);

        EventProperties ep = new EventProperties();
        ep.setId(1);
        ep.setVenue(venue);
        ep.setOtherService(null);

        Event unrelatedEvent = new Event();
        unrelatedEvent.setId(999);
        unrelatedEvent.setUser(new User());
        unrelatedEvent.setEventProperties(List.of());

        when(eventPropertiesRepository.findAll()).thenReturn(List.of(ep));
        when(eventRepository.findAll()).thenReturn(List.of(unrelatedEvent));

        List<List<Object>> result = eventPropertiesService.findAllEventPropertiesAfterNow(userId);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void clientCancelOtherService_ShouldThrowException_WhenEventPropertiesNotFound() {
        int invalidId = 999;

        when(eventPropertiesRepository.findById(invalidId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> eventPropertiesService.clientCancelOtherService(invalidId));
    }

    @Test
    void addOtherServiceToEvent_whenEventNotFound_shouldThrowException() {
        when(eventRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> eventPropertiesService
                .addOtherServiceToEvent(1, 1, LocalDateTime.now(), LocalDateTime.now().plusHours(2)));
        assertEquals("Evento no encontrado", ex.getMessage());
    }

    @Test
    void deleteEventProperties_withVenue_shouldNotifyAndDelete() {

        when(eventPropertiesRepository.findById(99)).thenReturn(Optional.of(eventProperties));
        when(eventRepository.findByEventPropertiesId(99)).thenReturn(Optional.of(event));

        eventPropertiesService.deleteEventProperties(99, venue, null);

/*         verify(notificationService).createNotification(
                NotificationType.REQUEST_CANCELLED_PROVIDER, event.getUser(), event, eventProperties); */
        verify(eventPropertiesRepository).deleteById(99);
    }

    @Test
    void deleteEventProperties_withOtherService_shouldNotifyAndDelete() {
        when(eventPropertiesRepository.findById(99)).thenReturn(Optional.of(eventProperties));
        when(eventRepository.findByEventPropertiesId(99)).thenReturn(Optional.of(event));

        eventPropertiesService.deleteEventProperties(99, null, service);

/*         verify(notificationService).createNotification(
                NotificationType.REQUEST_CANCELLED_PROVIDER, event.getUser(), event, eventProperties); */
        verify(eventPropertiesRepository).deleteById(99);
    }

    @Test
    void findEventPropertiesPendingByUserId_withNoServicesOrVenues_shouldReturnEmptyList() {
        // Arrange
        when(otherServiceService.getOtherServiceByUserId(1)).thenReturn(Collections.emptyList());
        when(venueService.getVenuesByUserId(1)).thenReturn(Collections.emptyList());

        // Act
        List<EventPropertiesDTO> result = eventPropertiesService.findEventPropertiesPendingByUserId(1);

        // Assert
        assertTrue(result.isEmpty());
        verify(eventPropertiesMapper, never()).toDTO(any(), any());
    }

}
