package com.eventbride.otherService;

import com.eventbride.service.Service;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "other_services")
@Getter
@Setter
public class OtherService extends Service {

    @Enumerated(EnumType.STRING)
    @Column(name = "other_service_type", nullable = false)
    private OtherServiceType otherServiceType;

    @Column(name = "extra_information", nullable = false)
    @NotBlank
    @Size(min = 1, max = 250)
    private String extraInformation;

    public enum OtherServiceType {
        CATERING, 
        ENTERTAINMENT, 
        DECORATION
    }
}
