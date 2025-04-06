package com.eventbride.dto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.eventbride.dto.EventDTO;
import com.eventbride.dto.EventPropertiesDTO;
import com.eventbride.event.Event;
import com.eventbride.dto.EventPropertiesMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EventMapper {

    @Autowired
    @Lazy
    private EventPropertiesMapper eventPropertiesMapper;

    public EventDTO toDTO(Event event) {
        List<EventPropertiesDTO> propertiesDTO = event.getEventProperties()
                .stream()
                .map(eventPropertiesMapper::toDTOWithoutEvent) 
                .collect(Collectors.toList());
        return new EventDTO(event, propertiesDTO);
    }

    public List<EventDTO> toDTOList(List<Event> events) {
        return events.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}
