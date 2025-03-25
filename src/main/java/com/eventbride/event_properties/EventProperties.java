package com.eventbride.event_properties;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.eventbride.event.Event;
import com.eventbride.model.BaseEntity;
import com.eventbride.otherService.OtherService;
import com.eventbride.payment.Payment;
import com.eventbride.venue.Venue;
/*import com.fasterxml.jackson.annotation.JsonIgnore;*/


import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EventProperties extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "other_service_id", nullable = true)
    private OtherService otherService;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = true)
    private Venue venue;

    @Column(name = "start_time", nullable = true)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = true)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = true)
    private Status status;

    @Column(name = "deposit_amount", nullable = true)
    @DecimalMin("0.0")
    private Double depositAmount;

    @Column(name = "price_per_service", nullable = false)
    @DecimalMin("0.0")
    private BigDecimal pricePerService;

    @Column(name = "book_date", nullable = false)
    private LocalDateTime bookDateTime;

    @OneToMany(mappedBy = "eventProperties", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Payment> payments;

    @ManyToOne
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private Event event;

    public enum Status {
        PENDING,
        APPROVED,
        CANCELLED,
        DEPOSIT_PAID,
        COMPLETED
    }

}