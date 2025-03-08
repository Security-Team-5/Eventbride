package com.eventbride.dto;

import java.math.BigDecimal;
import java.util.List;

import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherService.OtherServiceType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtherServiceDTO {
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
    private OtherServiceType otherServiceType;
    private String extraInformation;
    private List<RatingDTO> ratingsDTO;
    private UserDTO userDTO;



    // Constructor para simplificar la creación del DTO
    public OtherServiceDTO(OtherService otherService) {
        this.name = otherService.getName();
        this.available = otherService.getAvailable();
        this.cityAvailable = otherService.getCityAvailable();
        this.servicePricePerGuest = otherService.getServicePricePerGuest();
        this.servicePricePerHour = otherService.getServicePricePerHour();
        this.fixedPrice = otherService.getFixedPrice();
        this.picture = otherService.getPicture();
        this.description = otherService.getDescription();
        this.hours = otherService.getHours();
        this.limitedByPricePerGuest = otherService.getLimitedByPricePerGuest();
        this.limitedByPricePerHour = otherService.getLimitedByPricePerHour();
        this.otherServiceType = otherService.getOtherServiceType();
        this.extraInformation = otherService.getExtraInformation();
        if(otherService.getRatings() != null){
            this.ratingsDTO = RatingDTO.fromEntities(otherService.getRatings());
        }
        if(otherService.getUser() != null){
            this.userDTO = new UserDTO(otherService.getUser());
        }

    }

    // Método estático para crear una lista de DTOs a partir de una lista de entidades
    public static List<OtherServiceDTO> fromEntities(List<OtherService> otherServices) {
        return otherServices.stream()
                .map(OtherServiceDTO::new)
                .toList();
    }
}
