package com.eventbride.rating;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;

import jakarta.transaction.Transactional;

public interface RatingRepository extends CrudRepository<Rating, Integer>{

    List<Rating> findAll();

    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId")
    List<Rating> findAllRatingsByUserId(int userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Rating r WHERE r.otherService=?1")
    void deleteByOtherService(OtherService otherService);

    @Modifying
    @Transactional
    @Query("DELETE FROM Rating r WHERE r.venue =?1")
    void deleteByVenue(Venue venue);

    
}
