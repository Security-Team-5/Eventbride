package com.eventbride.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.eventbride.user.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Integer id;
    private String lastname;
    private String firstname;
    private String username;
    private String email;
    private Integer telephone;
    private String dni;
    private String profilePicture;
    private String role;
    private List<EventDTO> events;

    // Constructor que toma la entidad User y la convierte a DTO
    public UserDTO(User user) {
        this.id = user.getId();
        this.lastname = user.getLastName();
        this.firstname = user.getFirstName();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.telephone = user.getTelephone();
        this.dni = user.getDni();
        this.profilePicture = user.getProfilePicture();
        this.role = user.getRole();
        if(user.getEvents() != null){
            this.events = user.getEvents().stream()
                    .map(EventDTO::new)  // Convertir la lista de eventos a DTOs
                    .collect(Collectors.toList());
        }
    }

    // Método estático para convertir una lista de usuarios en una lista de DTOs
    public static List<UserDTO> fromEntities(List<User> users) {
        return users.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }
}
