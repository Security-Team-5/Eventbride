package com.eventbride.rating;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface RatingRepository extends CrudRepository<Rating, Integer>{

    List<Rating> findAll();

    @Query("SELECT r FROM Rating r WHERE r.user.id = :userId")
    List<Rating> findAllRatingsByUserId(int userId);

    
}
