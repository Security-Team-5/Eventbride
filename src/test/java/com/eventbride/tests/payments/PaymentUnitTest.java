package com.eventbride.tests.payments;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.event_properties.EventProperties.Status;
import com.eventbride.notification.NotificationService;
import com.eventbride.otherService.OtherService;
import com.eventbride.payment.Payment;
import com.eventbride.payment.PaymentRepository;
import com.eventbride.payment.PaymentService;
import com.eventbride.user.User;
import com.eventbride.user.UserRepository;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class PaymentUnitTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private EventPropertiesRepository eventPropertiesRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private PaymentService paymentService;

    private EventProperties eventProperties;
    private User user;
    private User user2;
    private Event event;
    private OtherService otherService;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1);
        user.setRole("CLIENT");

        user2= new User();
        user2.setId(3);

        eventProperties = new EventProperties();
        eventProperties.setId(1);
        eventProperties.setDepositAmount(100.0);
        eventProperties.setPricePerService(BigDecimal.valueOf(500.0));
        eventProperties.setStatus(Status.APPROVED);

        event = new Event();
        event.setId(1);
        event.setUser(user);

        otherService = new OtherService();
        otherService.setId(1);
    }

    @Test
    void shouldPayDepositSuccessfully() {
        event.setId(7);
        user.setId(2);
        eventProperties.setId(23);
        event.setEventProperties(List.of(eventProperties));
        event.setUser(user);
        otherService.setId(4);
        eventProperties.setOtherService(otherService);

        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(eventRepository.findByEventPropertiesId(23)).thenReturn(Optional.of(event));
        when(eventPropertiesRepository.findById(23)).thenReturn(Optional.of(eventProperties));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        Payment result = paymentService.payDeposit(23, 2);

        assertNotNull(result);
        assertEquals(Payment.PaymentType.DEPOSIT, result.getPaymentType());
        assertEquals(user, result.getUser());
        assertEquals(eventProperties, result.getEventProperties());
        verify(notificationService).createNotification(any(), any(), any(), any(), any());
    }

    @Test
    void shouldThrowWhenUserNotAuthorizedForDeposit() {
        user.setId(2);
        eventProperties.setId(26);

        event.setId(3);
        user.setId(2);
        eventProperties.setId(8);
        event.setEventProperties(List.of(eventProperties));
        event.setUser(user2);
        otherService.setId(3);
        eventProperties.setOtherService(otherService);

        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(eventRepository.findByEventPropertiesId(26)).thenReturn(Optional.of(event));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.payDeposit(26, 2);
        });

        assertEquals("El usuario no está autorizado para realizar este pago", exception.getMessage());
    }

    @Test
    void shouldPayRemainingSuccessfully() {
        Payment deposit = new Payment();
        deposit.setAmount(105.0); // 100 + 5% comisión

        event.setId(7);
        user.setId(2);
        eventProperties.setId(23);
        event.setEventProperties(List.of(eventProperties));
        event.setUser(user);
        otherService.setId(4);
        eventProperties.setOtherService(otherService);

        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(eventRepository.findByEventPropertiesId(23)).thenReturn(Optional.of(event));
        when(eventPropertiesRepository.findById(23)).thenReturn(Optional.of(eventProperties));
        when(paymentRepository.filterByEventPropertiesId(23)).thenReturn(deposit);
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        Payment result = paymentService.payRemaining(23, 2);

        assertNotNull(result);
        assertEquals(Payment.PaymentType.REMAINING, result.getPaymentType());
        assertEquals(user, result.getUser());
        assertEquals(eventProperties, result.getEventProperties());
        verify(notificationService).createNotification(any(), any(), any(), any(), any());
    }

    @Test
    void shouldThrowWhenUserNotAuthorizedForRemainingPayment() {
        user.setId(2);

        eventProperties.setId(26);

        otherService.setId(3);
        eventProperties.setOtherService(otherService);

        event.setId(3);
        event.setUser(user2);
        event.setEventProperties(List.of(eventProperties));

        when(userRepository.findById(2)).thenReturn(Optional.of(user));
        when(eventRepository.findByEventPropertiesId(26)).thenReturn(Optional.of(event));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.payRemaining(26, 2);
        });

        assertEquals("El usuario no está autorizado para realizar este pago", exception.getMessage());
    }

    @Test
    void shouldPayPlanSuccessfully() {

        user.setId(10);

        when(userRepository.findById(10)).thenReturn(Optional.of(user));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        Payment result = paymentService.payPlan(10, 50.00);

        assertNotNull(result);
        assertEquals(Payment.PaymentType.PLAN, result.getPaymentType());
        assertEquals(50.00, result.getAmount());
        assertEquals(user, result.getUser());
    }

    @Test
    void shouldGetPaymentsFromEventId() {
        List<Payment> payments = List.of(new Payment(), new Payment());
        when(paymentRepository.findPaymentsByEventId(1)).thenReturn(payments);

        List<Payment> result = paymentService.getPaymentsFromEventId(1);

        assertEquals(2, result.size());
    }

    @Test
    void shouldGetPaymentsForProviderSuccessfully() {
        user.setId(10);

        List<Payment> payments = List.of(new Payment());
        when(paymentRepository.findPaymentsByProviderUserId(10)).thenReturn(payments);

        List<Payment> result = paymentService.getPaymentsForProvider(10);

        assertFalse(result.isEmpty());
    }

    @Test
    void shouldThrowWhenNoPaymentsForProvider() {
        user.setId(10);

        when(paymentRepository.findPaymentsByProviderUserId(10)).thenReturn(List.of());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            paymentService.getPaymentsForProvider(10);
        });

        assertEquals("No se han encontrado pagos para el proveedor con ID: 10", exception.getMessage());
    }

}

