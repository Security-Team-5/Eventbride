package com.eventbride.dto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.eventbride.dto.EventDTO;
import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.event.Event;
import com.eventbride.event_properties.EventProperties;
import com.eventbride.event_properties.EventPropertiesService;

@Component
public class EventPropertiesMapper {

    public EventPropertiesDTO toDTO(EventProperties eventProperties, Event event) {
    List<EventPropertiesDTO> eventPropsDTO = event.getEventProperties()
        .stream()
        .map(this::toDTOWithoutEvent)
        .collect(Collectors.toList());

    EventDTO eventDTO = new EventDTO(event, eventPropsDTO);
    return new EventPropertiesDTO(eventProperties, eventDTO);
    }

    public EventPropertiesDTO toDTOWithoutEvent(EventProperties ep) {
        return new EventPropertiesDTO(ep, null);
    }
}