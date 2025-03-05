package com.eventbride.event;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.eventbride.invitation.Invitation;
import com.eventbride.model.BaseEntity;
import com.eventbride.otherService.OtherService;
import com.eventbride.user.User;
import com.eventbride.venue.Venue;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "events")
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
    private BigDecimal budget;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "event")
    private List<Invitation> invitations;

    public enum EventType {
        WEDDING, 
        CHRISTENING, 
        COMMUNION
    }

    @OneToMany(mappedBy = "event")
    private List<Venue> venues;

    @OneToMany(mappedBy = "event")
    private List<OtherService> otherServices;

}