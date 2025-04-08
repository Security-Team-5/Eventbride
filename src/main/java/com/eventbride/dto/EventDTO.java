package com.eventbride.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.eventbride.event.Event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventDTO {
    private Integer id;
    private Event.EventType eventType;
    private Integer guests;
    private LocalDate eventDate;
    private List<EventPropertiesDTO> eventPropertiesDTO;
    private String UserEmail;
    private String name;

    // Constructor para simplificar la creación del DTO
    public EventDTO(Event event, List<EventPropertiesDTO> evenPropDTO) {
        this.id = event.getId();
        this.eventType = event.getEventType();
        this.guests = event.getGuests();
        this.eventDate = event.getEventDate();
        this.eventPropertiesDTO = evenPropDTO;
        this.UserEmail = event.getUser().getEmail();
        this.name = event.getName();
    }
}
