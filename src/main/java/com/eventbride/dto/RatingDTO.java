package com.eventbride.dto;

import java.util.List;

import com.eventbride.rating.Rating;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingDTO {
    private Integer stars;
    private String comment;

    public RatingDTO(Rating rating) {
        this.stars = rating.getStars();
        this.comment = rating.getComment();
    }

    public static List<RatingDTO> fromEntities(List<Rating> ratings) {
        return ratings.stream()
                .map(RatingDTO::new)
                .toList();
    }
}
