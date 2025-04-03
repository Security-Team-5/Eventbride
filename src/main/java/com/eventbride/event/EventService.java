package com.eventbride.event;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.dto.EventDTO;
import com.eventbride.notification.Notification;
import com.eventbride.notification.NotificationService;
import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

import org.springframework.stereotype.Service;

@Service
public class EventService {
    private EventRepository eventRepository;
    private NotificationService notificationService;

    @Autowired
    public EventService(EventRepository eventRepository, NotificationService notificationService) {
        this.notificationService = notificationService;
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<EventDTO> getAllEventsDTO() {
        List<Event> events = eventRepository.findAll();
        return EventDTO.fromEntities(events);
    }

    @Transactional(readOnly = true)
    public Event findById(int id) throws IllegalArgumentException {
        Optional<Event> g = eventRepository.findById(id);
		if(!g.isPresent()) {
			throw new IllegalArgumentException("El evento no existe");
		}
        return g.get();
    }

    @Transactional
    public Event save(Event event) throws DataAccessException {
        notificationService.createNotification(Notification.NotificationType.EVENT_CREATED, event.getUser(), event, null);
        return eventRepository.save(event);
    }

    @Transactional
	public Event updateEvent(Event event, int id) throws DataAccessException {
		Event toUpdate = findById(id);
		BeanUtils.copyProperties(event, toUpdate);
		return save(toUpdate);
	}

	@Transactional
	public void deleteEvent(int id) throws DataAccessException {
		Event toDelete = findById(id);
		eventRepository.delete(toDelete);
	}

    @Transactional
    public Optional<Event> getRecentEventByUserId(Integer userId) {
        return eventRepository.findRecentEventByUserId(userId);
    }

    @Transactional
    public List<Event> findEventsByUserId(Integer userId) {
        return eventRepository.findAllEventsByUserId(userId);
    }

    @Transactional
    public List<Event> findEventsByUserIdWithoutAService(Integer userId, Integer serviceId) {
        return eventRepository.findAllEventsByUserIdWithoutAService(userId, serviceId);
    }

    public void saveAll(List<Event> events) {
        eventRepository.saveAll(events);
    }
}
