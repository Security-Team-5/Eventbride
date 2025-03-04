package com.eventbride.rating;

import com.eventbride.model.BaseEntity;
import com.eventbride.service.Service;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    @NotBlank
    @Size(min = 1, max = 5)
    private String stars;

    @Column(name = "comment", nullable = false)
    @NotBlank
    @Size(min = 1, max = 500)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;
    
}
