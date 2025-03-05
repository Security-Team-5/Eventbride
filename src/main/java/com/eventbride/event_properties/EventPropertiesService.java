package com.eventbride.event_properties;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.event.Event;

import org.springframework.stereotype.Service;

@Service
public class EventPropertiesService {
    private EventPropertiesRepository eventPropertiesRepository;

    @Autowired
    public EventPropertiesService(EventPropertiesRepository eventPropertiesRepository) {
        this.eventPropertiesRepository = eventPropertiesRepository;
    }

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
    public EventProperties findEventPropertiesByEvent(Event event){
        return eventPropertiesRepository.findEventPropertiesByEvent(event);
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByOtherService(Event event){
        return eventPropertiesRepository.findEventPropertiesByOtherService(event);
    }

    @Transactional(readOnly = true)
    public EventProperties findEventPropertiesByVenue(Event event){
        return eventPropertiesRepository.findEventPropertiesByVenue(event);
    }    
}
