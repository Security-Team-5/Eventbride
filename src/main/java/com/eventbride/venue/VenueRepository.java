package com.eventbride.venue;

import com.eventbride.otherService.OtherService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Integer> {
	List<Venue> findByUserId(Integer userId);
}
