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
    private Event.EventType eventType;
    private Integer guests;
    private BigDecimal budget;
    private LocalDate eventDate;

    // Constructor para simplificar la creación del DTO
    public EventDTO(Event event) {
        this.eventType = event.getEventType();
        this.guests = event.getGuests();
        this.budget = event.getBudget();
        this.eventDate = event.getEventDate();
    }

    // Método estático para crear una lista de DTOs a partir de una lista de entidades
    public static List<EventDTO> fromEntities(List<Event> events) {
        return events.stream()
                .map(EventDTO::new)
                .toList();
    }
}
