package com.eventbride.service;

import java.math.BigDecimal;
import java.util.List;

import com.eventbride.model.BaseEntity;
import com.eventbride.rating.Rating;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Inheritance;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @Column(name = "service_price", precision = 9, scale = 2, nullable = false)
    @Digits(integer = 7, fraction = 2)
    @NotNull
    @DecimalMin("0.0")
    private BigDecimal servicePrice;

    @Column(name = "picture", nullable = false)
    @NotBlank
    @Size(min = 1, max = 250)
    private String picture;

    @Column(name = "description", nullable = false)
    @NotBlank
    @Size(min = 1, max = 250)
    private String description;

    /* COMENTADO HASTA TENER LA CLASE SUPPLIER 
    @ManyToOne(optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier; */

}
