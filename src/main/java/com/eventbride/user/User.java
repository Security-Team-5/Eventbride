package com.eventbride.user;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.eventbride.event.Event;
import com.eventbride.model.Person;
import com.eventbride.otherService.OtherService;
import com.eventbride.rating.Rating;
import com.eventbride.venue.Venue;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
public class User extends Person implements UserDetails{
    @Column(name = "dni", nullable = false, unique = true)
    @NotBlank
    @Size(min = 1, max = 9)
    private String dni;

    @Column(name = "profile_picture", nullable = false)
    @NotBlank
    @Size(min = 1, max = 500)
    private String profilePicture;

    @Column(name = "role", nullable = false)
    @NotBlank
    private String role;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Event> events;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Rating> ratings;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<OtherService> otherServices;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Venue> venues;

    @Override
    public Collection< ? extends GrantedAuthority> getAuthorities() {
        return List.of( new SimpleGrantedAuthority(role));
    }
}
