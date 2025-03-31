package com.eventbride.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.dto.PaymentDTO;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/{eventId}")
    public ResponseEntity<List<PaymentDTO>> getPaymentsFromEventId(@PathVariable Integer eventId) {
        try {
            List<Payment> payments = paymentService.getPaymentsFromEventId(eventId);
            return ResponseEntity.ok(PaymentDTO.fromEntities(payments));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{eventPropertiesId}/pay-deposit/{userId}")
    public ResponseEntity<?> createPaymentDeposit(@PathVariable Integer eventPropertiesId,
            @PathVariable Integer userId) {
        try {
            Payment newPayment = paymentService.payDeposit(eventPropertiesId, userId);
            return ResponseEntity.ok(newPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FALTA FUNCIONES PARA PAGO RESTANTE
    @PostMapping("/{eventPropertiesId}/pay-remaining/{userId}")
    public ResponseEntity<?> createPaymentRemaining(@PathVariable Integer eventPropertiesId,
            @PathVariable Integer userId) {
        try {
            Payment newPayment = paymentService.payRemaining(eventPropertiesId, userId);
            return ResponseEntity.ok(newPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/plan/{userId}")
    public ResponseEntity<?> createPaymentPlan(@PathVariable Integer userId, @RequestBody @Valid Double amount){
        try {
            Payment newPayment = paymentService.payPlan(userId, amount);
            return ResponseEntity.ok(newPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}