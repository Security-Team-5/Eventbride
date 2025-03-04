package com.eventbride.event;

import java.time.LocalDate;


import com.eventbride.model.BaseEntity;
import com.eventbride.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import lombok.Setter;
import lombok.Getter;

@Entity
@Table(name = "event")
@Getter
@Setter
public class Event extends BaseEntity{
    
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "guests", nullable = false)
    @Min(1)
    private Integer guests;

    @Column(name = "budget", precision = 9, scale = 2, nullable = false)
    @Digits(integer = 7, fraction = 2)
    @DecimalMin("0.0")
    private Double budget;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum EventType {
        WEDDING, 
        CHRISTENING, 
        COMMUNION
    }

}
