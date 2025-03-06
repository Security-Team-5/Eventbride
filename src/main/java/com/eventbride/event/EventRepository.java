package com.eventbride.event;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

public interface EventRepository extends CrudRepository<Event, Integer>{

    List<Event> findAll();

    @Query("SELECT DISTINCT event FROM Event event WHERE event.user.id = :userId")
	public Event findByUserId(int userId);

    @Query("SELECT ep.otherService FROM EventProperties ep WHERE ep.event=?1")
    public List<OtherService> findOthersServicesByEvent(Event event);

    @Query("SELECT ep.venue FROM EventProperties ep WHERE ep.event=?1")
    public List<Venue> findVenuesByEvent(Event event);
}