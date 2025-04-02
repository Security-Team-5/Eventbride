package com.eventbride.event_properties;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.eventbride.event.Event;
import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

@Repository
public interface EventPropertiesRepository extends CrudRepository<EventProperties, Integer> {

    List<EventProperties> findAll();

    @Query("SELECT ep FROM EventProperties ep WHERE ep.venue.user.id=:userId OR ep.otherService.user.id=:userId")
    public List<EventProperties> findEventPropertiesByUserId(Integer userId);

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

    @Query("""
                SELECT ep FROM EventProperties ep
                WHERE DATE(ep.startTime) = :fecha
                AND ep.venue.id = :venueId
                AND ep.id <> :eventPropId
            """)
    List<EventProperties> findVenuesToCancel(
            @Param("fecha") LocalDate fecha,
            @Param("venueId") Integer venueId,
            @Param("eventPropId") Integer eventPropId);

    @Query("""
                SELECT ep FROM EventProperties ep
                WHERE DATE(ep.startTime) = :fecha
                AND ep.otherService.id = :otherServiceId
                AND ep.id <> :eventPropId
            """)
    List<EventProperties> findOtherServicesToCancel(
            @Param("fecha") LocalDate fecha,
            @Param("otherServiceId") Integer otherServiceId,
            @Param("eventPropId") Integer eventPropId);

    @Query("""
                SELECT e FROM Event e
                JOIN e.eventProperties ep
                WHERE ep.id = :eventPropertiesId
            """)
    Event findEventByEventPropertiesId(@Param("eventPropertiesId") Integer eventPropertiesId);
}
