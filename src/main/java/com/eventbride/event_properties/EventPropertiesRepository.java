package com.eventbride.event_properties;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.eventbride.event.Event;

public interface EventPropertiesRepository extends CrudRepository<EventProperties, Integer>{

    List<EventProperties> findAll();

	@Query("SELECT ep FROM Event e JOIN e.eventProperties ep WHERE e = :event")
    public List<EventProperties> findEventPropertiesByEvent(Event event);

    @Query("SELECT DISTINCT ep FROM EventProperties ep WHERE ep.otherService=?1")
	public EventProperties findEventPropertiesByOtherService(Event event);

    @Query("SELECT DISTINCT ep FROM EventProperties ep WHERE ep.venue=?1")
	public EventProperties findEventPropertiesByVenue(Event event);
}
