package com.eventbride.payment;

import java.time.LocalDateTime;

import com.eventbride.event_properties.EventProperties;
import com.eventbride.model.BaseEntity;
import com.eventbride.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;                                  
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "payments")
public class Payment extends BaseEntity {

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne
    @JoinColumn(name="event_properties_id", nullable=true)
    private EventProperties eventProperties;

    public enum PaymentType {
        DEPOSIT,
        REMAINING,
        COMMISSION,
        PLAN
    }
    
}
