package com.eventbride.event_properties;

import java.time.LocalDate;

import com.eventbride.event.Event;
import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class EventProperties {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = true)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "other_service_id", nullable = true)
    private OtherService otherService;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = true)
    private Venue venue;

    @Column(name = "approved", nullable = true)
    private Boolean approved;

    @Column(name = "request_date", nullable = true)
    private LocalDate requestDate;

}