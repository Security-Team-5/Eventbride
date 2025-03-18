package com.eventbride.dto;

import java.time.LocalDate;
import java.util.List;

import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventProperties.Status;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventPropertiesDTO {
    private Integer id;
    private Boolean approved;
    private LocalDate requestDate;
    private VenueDTO venueDTO;
    private OtherServiceDTO otherServiceDTO;
    private Status status;

    
    // Constructor para simplificar la creación del DTO
    public EventPropertiesDTO(EventProperties eventProperties) {
        this.id = eventProperties.getId();
        this.status = eventProperties.getStatus();
        this.requestDate = eventProperties.getStartTime().toLocalDate();
        if(eventProperties.getVenue() != null){
            this.venueDTO = new VenueDTO(eventProperties.getVenue());
        }
        if(eventProperties.getOtherService() != null){
            this.otherServiceDTO = new OtherServiceDTO(eventProperties.getOtherService());
        }
    }

    // Método estático para crear una lista de DTOs a partir de una lista de entidades
    public static List<EventPropertiesDTO> fromEntities(List<EventProperties> eventProperties) {
        return eventProperties.stream()
                .map(EventPropertiesDTO::new)
                .toList();
    }

    public static EventPropertiesDTO fromEntity(EventProperties eventProperty) {
        return new EventPropertiesDTO(eventProperty);
    }
    
}
