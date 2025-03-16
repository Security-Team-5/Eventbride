package com.eventbride.event_properties;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;

import org.springframework.stereotype.Service;

@Service
public class EventPropertiesService {
    private EventPropertiesRepository eventPropertiesRepository;
    private EventRepository eventRepository;

    @Autowired
    public EventPropertiesService(EventPropertiesRepository eventPropertiesRepository, EventRepository eventRepository) {
        this.eventPropertiesRepository = eventPropertiesRepository;
        this.eventRepository = eventRepository;

    }

    @Autowired
    OtherServiceRepository otherServiceRepository;
    
    @Autowired
    VenueRepository venueRepository;


    @Transactional(readOnly = true)
    public List<EventProperties> findAll() {
        return eventPropertiesRepository.findAll();
    }

    @Transactional(readOnly = true)
    public EventProperties findById(int id) throws DataAccessException {
        Optional<EventProperties> g = eventPropertiesRepository.findById(id);
        return g.get();
    }

    @Transactional
    public EventProperties save(EventProperties eventProperties) throws DataAccessException {
        return eventPropertiesRepository.save(eventProperties);
    }

    @Transactional
    public EventProperties updateEventProperties(EventProperties eventProperties, int id) throws DataAccessException {
        EventProperties toUpdate = findById(id);
        BeanUtils.copyProperties(eventProperties, toUpdate);
        return save(toUpdate);
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByEvent(Event event) {
        return (EventProperties) eventPropertiesRepository.findEventPropertiesByEvent(event);
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByOtherService(Event event) {
        return eventPropertiesRepository.findEventPropertiesByOtherService(event);
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByVenue(Event event) {
        return eventPropertiesRepository.findEventPropertiesByVenue(event);
    }

    @Transactional
    public Event addOtherServiceToEvent(Integer eventId, Integer otherServiceId) {
        Optional<Event> event = eventRepository.findById(eventId);
        OtherService service = otherServiceRepository.findById(otherServiceId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        EventProperties eventProperties = new EventProperties();
        eventProperties.setOtherService(service);
        eventProperties.setVenue(null);
        eventPropertiesRepository.save(eventProperties);
        event.get().getEventProperties().add(eventProperties);
        eventRepository.save(event.get());
        return event.get();
    }

    @Transactional
    public Event addOtherServiceToEventWithHours(Integer eventId, Integer otherServiceId, Integer hours) {
        Optional<Event> event = eventRepository.findById(eventId);
        OtherService service = otherServiceRepository.findById(otherServiceId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        Boolean servicePerHour = service.getLimitedByPricePerHour();

        EventProperties eventProperties = new EventProperties();
        eventProperties.setOtherService(service);
        eventProperties.setVenue(null);
        eventPropertiesRepository.save(eventProperties);
        event.get().getEventProperties().add(eventProperties);
        eventRepository.save(event.get());
        return event.get();
    }

    @Transactional
    public Event addVenueToEvent(Integer eventId, Integer venueId, Integer hours) {
        Optional<Event> event = eventRepository.findById(eventId);
        Venue service = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        Boolean servicePerHour = service.getLimitedByPricePerHour();

        EventProperties eventProperties = new EventProperties();
        eventProperties.setVenue(service);
        eventProperties.setVenue(null);
        eventPropertiesRepository.save(eventProperties);
        event.get().getEventProperties().add(eventProperties);
        eventRepository.save(event.get());
        return event.get();
    }
}
