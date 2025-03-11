package com.eventbride.venue;

import java.util.List;

import com.eventbride.rating.Rating;
import com.eventbride.service.Service;
import com.eventbride.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "venues")
@Getter
@Setter

public class Venue extends Service {

    @Column(name = "postal_code", nullable = false)
    @NotBlank
    @Size(min = 1, max = 5)
    private String postalCode;

    @Column(name = "coordinates", nullable = false)
    @NotBlank
    @Size(min = 1, max = 30)
    private String coordinates;

    @Column(name = "address", nullable = false)
    @NotBlank
    @Size(min = 1, max = 50)
    private String address;

    @Column(name = "max_guests", nullable = false)
    @Min(1)
    private int maxGuests;

    @Column(name = "surface", nullable = false)
    @DecimalMin("0.0")
    private double surface;

    @OneToMany(fetch = FetchType.EAGER)
	@JoinColumn(name = "venue_id")
    private List<Rating> ratings;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
