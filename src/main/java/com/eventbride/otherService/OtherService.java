package com.eventbride.otherService;

import java.util.List;

import com.eventbride.event_properties.EventProperties;
import com.eventbride.rating.Rating;
import com.eventbride.service.Service;
import com.eventbride.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @OneToMany(mappedBy = "otherService")
    private List<Rating> ratings;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "otherService", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventProperties> eventProperties;

}