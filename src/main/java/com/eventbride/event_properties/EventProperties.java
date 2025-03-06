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
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "other_service_id", nullable = false)
    private OtherService otherService;

    @ManyToOne
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "approved", nullable = false)
    private Boolean approved;

    @Column(name = "request_date", nullable = false)
    private LocalDate requestDate;

}

