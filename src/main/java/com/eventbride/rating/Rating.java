package com.eventbride.rating;

import com.eventbride.model.BaseEntity;
import com.eventbride.otherService.OtherService;
import com.eventbride.user.User;
import com.eventbride.venue.Venue;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ratings")
@Getter
@Setter
public class Rating extends BaseEntity{

    @Column(name = "stars", nullable = false)
    @Min(1)
    @Max(5)
    private Integer stars;

    @Column(name = "comment", nullable = false)
    @NotBlank
    @Size(min = 1, max = 500)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "other_service_id")
    private OtherService otherService;

    @ManyToOne
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
