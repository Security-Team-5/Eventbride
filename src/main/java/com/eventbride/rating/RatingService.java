package com.eventbride.rating;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    private RatingRepository ratingRepository;

    @Autowired
    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public List<Rating> findRatingsByUserId(Integer userId) {
        return ratingRepository.findAllRatingsByUserId(userId);
    }

    public void saveAll(List<Rating> ratings) {
        ratingRepository.saveAll(ratings);
    }
}
