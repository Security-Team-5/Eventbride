package com.eventbride.event;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

public interface EventRepository extends CrudRepository<Event, Integer>{

    List<Event> findAll();

    @Query("SELECT DISTINCT event FROM Event event WHERE event.user.id = :userId")
	public Event findByUserId(int userId);

	@Query("SELECT ep.otherService FROM Event e JOIN e.eventProperties ep WHERE e = :event")
    public List<OtherService> findOthersServicesByEvent(Event event);

	@Query("SELECT ep.venue FROM Event e JOIN e.eventProperties ep WHERE e = :event")
    public List<Venue> findVenuesByEvent(Event event);

    @Query("SELECT e FROM Event e LEFT JOIN e.eventProperties ep WHERE e.user.id = :userId ORDER BY e.eventDate ASC LIMIT 1")
    Optional<Event> findRecentEventByUserId (Integer userId);

    @Query("SELECT e FROM Event e WHERE e.user.id = :userId")
    List<Event> findAllEventsByUserId(int userId);

    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN e.eventProperties ep ON ep.otherService.id = :serviceId WHERE e.user.id = :userId AND ep IS NULL")
    List<Event> findAllEventsByUserIdWithoutAService(@Param("userId") int userId, @Param("serviceId") int serviceId);




}
