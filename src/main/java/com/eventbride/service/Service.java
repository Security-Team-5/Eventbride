package com.eventbride.service;

import java.math.BigDecimal;

import com.eventbride.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public class Service extends BaseEntity {

    @Column(name = "name", nullable = false)
    @NotBlank
    @Size(min = 1, max = 500)
    private String name;
    
    @Column(name = "available", nullable = false)
    private Boolean available;

    @Column(name = "city_available", nullable = false)
    @NotBlank
    @Size(min = 1, max = 30)
    private String cityAvailable;

    @Column(name = "service_price_guest", precision = 9, scale = 2, nullable = false)
    @Digits(integer = 7, fraction = 2)
    @DecimalMin("0.0")
    private BigDecimal servicePricePerGuest;

    @Column(name = "service_price_hour", precision = 9, scale = 2, nullable = false)
    @Digits(integer = 7, fraction = 2)
    @DecimalMin("0.0")
    private BigDecimal servicePricePerHour;

    @Column(name = "fixed_price", precision = 9, scale = 2, nullable = false)
    @Digits(integer = 7, fraction = 2)
    @DecimalMin("0.0")
    private BigDecimal fixedPrice;

    @Column(name = "picture", nullable = false)
    @NotBlank
    @Size(min = 1, max = 250)
    // @Pattern(regexp = "^(https?:\\/\\/)?([\\w-]+\\.)+[\\w-]+(\\/[\\w-]*)*(\\?.*)?$")
    private String picture;

    @Column(name = "description", nullable = false)
    @NotBlank
    @Size(min = 1, max = 250)
    private String description;   

    @Column(name = "limited_by_price_per_guest", nullable = false)
    private Boolean limitedByPricePerGuest;

    @Column(name = "limited_by_price_per_hour", nullable = false)
    private Boolean limitedByPricePerHour;

}
