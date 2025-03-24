package com.eventbride.event_properties;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.eventbride.event.Event;
import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

import jakarta.transaction.Transactional;

public interface EventPropertiesRepository extends JpaRepository<EventProperties, Integer>{

    List<EventProperties> findAll();

	@Query("SELECT ep FROM Event e JOIN e.eventProperties ep WHERE e = :event")
    public List<EventProperties> findEventPropertiesByEvent(Event event);

    @Query("SELECT ep FROM EventProperties ep WHERE ep.otherService.id=?1")
	public List<EventProperties> findEventPropertiesByOtherServiceId(Integer otherServiceId);

    @Query("SELECT ep FROM EventProperties ep WHERE ep.venue.id=?1")
	public List<EventProperties> findEventPropertiesByVenueId(Integer venueId);

    @Modifying
    @Transactional
    @Query("DELETE FROM EventProperties ep WHERE ep.otherService=?1")
    void deleteByOtherService(OtherService otherService);

    @Modifying
    @Transactional
    @Query("DELETE FROM EventProperties ep WHERE ep.venue =?1")
    void deleteByVenue(Venue venue);

    @Query("SELECT ep FROM EventProperties ep WHERE ep.otherService=?1 AND ep.status=?2")
    List<EventProperties> findByOtherServiceAndStatus(OtherService otherService, EventProperties.Status status);

    @Query("SELECT ep FROM EventProperties ep WHERE ep.venue=?1 AND ep.status=?2")
    List<EventProperties> findByVenueAndStatus(Venue venue, EventProperties.Status status);
}
