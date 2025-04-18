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
	private Integer id;
    private String name;
    private Boolean available;
    private String cityAvailable;
    private BigDecimal servicePricePerGuest;
    private BigDecimal servicePricePerHour;
    private BigDecimal fixedPrice;
    private String picture;
    private String description;
    private Boolean limitedByPricePerGuest;
    private Boolean limitedByPricePerHour;
    private OtherServiceType otherServiceType;
    private String extraInformation;
    private UserDTO userDTO;



    // Constructor para simplificar la creación del DTO
    public OtherServiceDTO(OtherService updated) {
		this.id = updated.getId();
        this.name = updated.getName();
        this.available = updated.getAvailable();
        this.cityAvailable = updated.getCityAvailable();
        this.servicePricePerGuest = updated.getServicePricePerGuest();
        this.servicePricePerHour = updated.getServicePricePerHour();
        this.fixedPrice = updated.getFixedPrice();
        this.picture = updated.getPicture();
        this.description = updated.getDescription();
        this.limitedByPricePerGuest = updated.getLimitedByPricePerGuest();
        this.limitedByPricePerHour = updated.getLimitedByPricePerHour();
        this.otherServiceType = updated.getOtherServiceType();
        this.extraInformation = updated.getExtraInformation();
        if(updated.getUser() != null){
            this.userDTO = new UserDTO(updated.getUser());
        }

    }

    // Método estático para crear una lista de DTOs a partir de una lista de entidades
    public static List<OtherServiceDTO> fromEntities(List<OtherService> otherServices) {
        return otherServices.stream()
                .map(OtherServiceDTO::new)
                .toList();
    }
}
