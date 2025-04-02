package com.eventbride.dto;

import java.util.List;

import com.eventbride.payment.Payment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentDTO {
    private Integer id;
    private Double amount;
    private String dateTime;
    private String paymentType;
    private Integer eventPropertiesId;
    private Integer userId;

    public PaymentDTO(Payment payment) {
        this.id = payment.getId();
        this.amount = payment.getAmount();
        this.dateTime = payment.getDateTime().toString();
        this.paymentType = payment.getPaymentType().toString();
        this.eventPropertiesId = payment.getEventProperties().getId();
        this.userId = payment.getUser().getId();
    }

    public static List<PaymentDTO> fromEntities(List<Payment> payments) {
        return payments.stream()
                .map(PaymentDTO::new)
                .toList();
    
    }
}
