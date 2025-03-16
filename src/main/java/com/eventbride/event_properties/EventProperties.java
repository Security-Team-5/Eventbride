package com.eventbride.event_properties;

import java.time.LocalDateTime;

import com.eventbride.model.BaseEntity;
import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;
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

    @Column(name = "status", nullable = true) 
    private Status status;

    @Column(name = "deposit_amount", nullable = false)
    @DecimalMin("0.0")
    private Double depositAmount;

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        DEPOSIT_PAID, 
        COMPLETED
    }

}