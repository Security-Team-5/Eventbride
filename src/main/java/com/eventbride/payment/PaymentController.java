package com.eventbride.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

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
}