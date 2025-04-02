package com.eventbride.payment;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesRepository;
import com.eventbride.notification.NotificationService;
import com.eventbride.notification.Notification.NotificationType;
import com.eventbride.event_properties.EventProperties.Status;
import com.eventbride.payment.Payment.PaymentType;
import com.eventbride.user.User;
import com.eventbride.user.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {
    private PaymentRepository paymentRepository;
    private EventPropertiesRepository eventPropertiesRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;
    private EventRepository eventRepository;
    private Double commissionRate = 0.05;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, EventPropertiesRepository eventPropertiesRepository,
            UserRepository userRepository, NotificationService notificationService, EventRepository eventRepository) {
        this.paymentRepository = paymentRepository;
        this.eventPropertiesRepository = eventPropertiesRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;	
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Payment payDeposit(Integer eventPropertiesId, Integer userId) {
        EventProperties e = eventPropertiesRepository.findById(eventPropertiesId).orElse(null);
        Payment p;

        if (e != null) {
            e.setStatus(Status.DEPOSIT_PAID);
            eventPropertiesRepository.save(e);

            p = new Payment();

            p.setAmount(e.getDepositAmount() + e.getDepositAmount() * commissionRate);
            p.setDateTime(LocalDateTime.now());
            p.setPaymentType(PaymentType.DEPOSIT);
            p.setEventProperties(e);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null)
                return null;

            p.setUser(user);

            paymentRepository.save(p);
            Optional<Event> event = eventRepository.findByEventPropertiesId(e.getId());
            notificationService.createNotification(NotificationType.NEW_DEPOSIT_PAYMENT, e.getVenue() != null ? e.getVenue().getUser() : e.getOtherService().getUser(), event.get(), e);
        } else {
            p = null;
        }
        return p;
    }

    // FALTA FUNCIONES PARA PAGO RESTANTE
    public Payment payRemaining(Integer eventPropertiesId, Integer userId) {
        EventProperties e = eventPropertiesRepository.findById(eventPropertiesId).orElse(null);
        Payment p;

        Double precioTotal = e.getPricePerService().doubleValue();
        Double comision = precioTotal * commissionRate;
        Double precioConComision = precioTotal + comision;

        Payment depositPayment = paymentRepository.filterByEventPropertiesId(eventPropertiesId);

        if (depositPayment != null && e != null) {
            e.setStatus(Status.COMPLETED);
            eventPropertiesRepository.save(e);

            // Payment de usuario cliente
            p = new Payment();

            p.setAmount(precioConComision - depositPayment.getAmount());
            p.setDateTime(LocalDateTime.now());
            p.setPaymentType(PaymentType.REMAINING);
            p.setEventProperties(e);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null)
                return null;

            p.setUser(user);
            paymentRepository.save(p);
            Optional<Event> event = eventRepository.findByEventPropertiesId(e.getId());
            notificationService.createNotification(NotificationType.NEW_REMAINING_PAYMENT, e.getVenue() != null ? e.getVenue().getUser() : e.getOtherService().getUser(), event.get(), e);
        } else {
            p = null;
        }
        return p;
    }

    @Transactional
    public Payment payPlan(Integer userId, Double amount) {
        Payment p = new Payment();

        p.setAmount(amount);
        p.setDateTime(LocalDateTime.now());
        p.setPaymentType(PaymentType.PLAN);
        p.setUser(userRepository.findById(userId).get());
        paymentRepository.save(p);
        return p;
    }
}