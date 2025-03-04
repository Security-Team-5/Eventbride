package com.eventbride.user;

import java.util.List;

import com.eventbride.event.Event;
import com.eventbride.invitation.Invitation;
import com.eventbride.model.Person;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends Person{
    @Column(name = "dni", nullable = false, unique = true)
    @NotBlank
    @Size(min = 1, max = 9)
    private String dni;

    @Column(name = "profile_picture", nullable = false)
    @NotBlank
    @Size(min = 1, max = 500)
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> events;

    public enum UserType {
        CLIENT, 
        SUPPLIER 
    }
}
