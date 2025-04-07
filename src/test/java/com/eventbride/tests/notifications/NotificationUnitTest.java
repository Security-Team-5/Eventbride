package com.eventbride.tests.notifications;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import com.eventbride.notification.Notification;
import com.eventbride.notification.NotificationRepository;
import com.eventbride.notification.NotificationService;
import com.eventbride.user.User;
import com.eventbride.user.UserRepository;
import com.eventbride.venue.Venue;
import com.eventbride.event.Event;
import com.eventbride.event_properties.EventProperties;

@SpringBootTest
class NotificationUnitTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JavaMailSender mailSender; 

    @InjectMocks
    private NotificationService notificationService;

    public NotificationUnitTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllNotificationsForUser() {
        
        String username = "testUser";
        User user = new User();
        user.setId(1);
        user.setUsername(username);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(notificationRepository.findByUserId(user.getId())).thenReturn(List.of(new Notification()));

        
        var notifications = notificationService.getAllNotificationsForUser(username);

        
        assertNotNull(notifications);
        assertEquals(1, notifications.size());
        verify(notificationRepository, times(1)).findByUserId(user.getId());
    }

    @Test
    void testCreateNotification() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.EVENT_CREATED);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);

        
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.EVENT_CREATED, user, event, null);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));

    }

    @Test
    void testCreateNotificationEventCreated() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.EVENT_CREATED);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.EVENT_CREATED, user, event, null);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationPaymentReminder() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.PAYMENT_REMINDER);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.PAYMENT_REMINDER, user, event, null);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationNewMessage() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.NEW_MESSAGE);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.NEW_MESSAGE, user, null, null);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationRequestCancelledProvider() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        EventProperties eventProperties = new EventProperties();
        Venue venue = new Venue();
        venue.setName("Test Venue"); 
        eventProperties.setVenue(venue);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.REQUEST_CANCELLED_PROVIDER);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.REQUEST_CANCELLED_PROVIDER, user, event, eventProperties);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationRequestCancelledAuto() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        EventProperties eventProperties = new EventProperties();
        Venue venue = new Venue();
        venue.setName("Test Venue");
        eventProperties.setVenue(venue);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.REQUEST_CANCELLED_AUTO);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.REQUEST_CANCELLED_AUTO, user, event, eventProperties);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationRequestConfirmed() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        EventProperties eventProperties = new EventProperties();
        Venue venue = new Venue();
        venue.setName("Test Venue");
        eventProperties.setVenue(venue);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.REQUEST_CONFIRMED);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.REQUEST_CONFIRMED, user, event, eventProperties);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationNewRequest() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        EventProperties eventProperties = new EventProperties();
        Venue venue = new Venue();
        venue.setName("Test Venue");
        eventProperties.setVenue(venue);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.NEW_REQUEST);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.NEW_REQUEST, user, event, eventProperties);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationNewDepositPayment() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        EventProperties eventProperties = new EventProperties();
        Venue venue = new Venue();
        venue.setName("Test Venue");
        eventProperties.setVenue(venue);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.NEW_DEPOSIT_PAYMENT);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.NEW_DEPOSIT_PAYMENT, user, event, eventProperties);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testCreateNotificationNewRemainingPayment() {
        
        User user = new User();
        user.setId(1);
        user.setUsername("testUser");
        user.setReceivesEmails(true);

        Event event = new Event();
        event.setId(1);
        event.setName("Test Event");

        EventProperties eventProperties = new EventProperties();
        Venue venue = new Venue();
        venue.setName("Test Venue");
        eventProperties.setVenue(venue);

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(Notification.NotificationType.NEW_REMAINING_PAYMENT);
        notification.setCreatedAt(LocalDateTime.now());

        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        
        notificationService.createNotification(Notification.NotificationType.NEW_REMAINING_PAYMENT, user, event, eventProperties);

        
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
