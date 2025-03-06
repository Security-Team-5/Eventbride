package com.eventbride.dto;

import java.math.BigDecimal;
import java.util.List;

import com.eventbride.venue.Venue;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VenueDTO {
    private String name;
    private Boolean available;
    private String cityAvailable;
    private BigDecimal servicePricePerGuest;
    private BigDecimal servicePricePerHour;
    private BigDecimal fixedPrice;
    private String picture;
    private String description;
    private Integer hours;
    private Boolean limitedByPricePerGuest;
    private Boolean limitedByPricePerHour;
    private String postalCode;
    private String coordinates;
    private String address;
    private int maxGuests;
    private double surface;
    private List<RatingDTO> ratingsDTO;
    private UserDTO userDTO;



    // Constructor para simplificar la creación del DTO
    public VenueDTO(Venue venue) {
        this.name = venue.getName();
        this.available = venue.getAvailable();
        this.cityAvailable = venue.getCityAvailable();
        this.servicePricePerGuest = venue.getServicePricePerGuest();
        this.servicePricePerHour = venue.getServicePricePerHour();
        this.fixedPrice = venue.getFixedPrice();
        this.picture = venue.getPicture();
        this.description = venue.getDescription();
        this.hours = venue.getHours();
        this.limitedByPricePerGuest = venue.getLimitedByPricePerGuest();
        this.limitedByPricePerHour = venue.getLimitedByPricePerHour();
        this.postalCode = venue.getPostalCode();
        this.coordinates = venue.getCoordinates();
        this.address = venue.getAddress();
        this.maxGuests = venue.getMaxGuests();
        this.surface = venue.getSurface();
        if(venue.getRatings() != null){
            this.ratingsDTO = RatingDTO.fromEntities(venue.getRatings());
        }
        if(venue.getUser() != null){
            this.userDTO = new UserDTO(venue.getUser());
        }
    }

    // Método estático para crear una lista de DTOs a partir de una lista de entidades
    public static List<VenueDTO> fromEntities(List<Venue> venues) {
        return venues.stream()
                .map(VenueDTO::new)
                .toList();
    }
}
