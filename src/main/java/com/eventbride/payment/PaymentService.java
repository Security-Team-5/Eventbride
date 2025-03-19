package com.eventbride.payment;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesRepository;
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

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, EventPropertiesRepository eventPropertiesRepository,
            UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.eventPropertiesRepository = eventPropertiesRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Payment payDeposit(Integer eventPropertiesId, Integer userId) {
        EventProperties e = eventPropertiesRepository.findById(eventPropertiesId).orElse(null);
        Payment p;

        if (e != null) {
            e.setStatus(Status.DEPOSIT_PAID);
            eventPropertiesRepository.save(e);

            p = new Payment();

            p.setAmount(e.getDepositAmount());
            p.setDateTime(LocalDateTime.now());
            p.setPaymentType(PaymentType.DEPOSIT);
            p.setEventProperties(e);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null)
                return null;

            p.setUser(user);

            paymentRepository.save(p);
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
        Double comision = precioTotal * 0.02;
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

            // Payment que se realiza a Eventbride
            Payment p2 = new Payment();

            p2.setAmount(comision);
            p2.setDateTime(LocalDateTime.now());
            p2.setPaymentType(PaymentType.COMMISSION);
            p2.setEventProperties(e);
            User adminUser = userRepository.findById(15).get();// Usuario administrador que representa la cuenta de la
                                                               // empresa
            p2.setUser(adminUser);
            paymentRepository.save(p2);
        } else {
            p = null;
        }
        return p;
    }
}