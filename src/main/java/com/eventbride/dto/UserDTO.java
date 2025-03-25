package com.eventbride.dto;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import com.eventbride.user.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Integer id;
    private String lastName;
    private String firstName;
    private String username;
    private String email;
    private Integer telephone;
    private String dni;
    private String profilePicture;
    private String role;
    private List<EventDTO> events;
    private User.Plan plan;
    private LocalDateTime paymentPlanDate;
    private LocalDateTime expirePlanDate;

    // Constructor que toma la entidad User y la convierte a DTO
    public UserDTO(User user) {
        this.id = user.getId();
        this.lastName = user.getLastName();
        this.firstName = user.getFirstName();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.telephone = user.getTelephone();
        this.dni = user.getDni();
        this.profilePicture = user.getProfilePicture();
        this.role = user.getRole();
        this.plan = user.getPlan();
        this.paymentPlanDate = user.getPaymentPlanDate();
        this.expirePlanDate = user.getExpirePlanDate();
    }

    // Método estático para convertir una lista de usuarios en una lista de DTOs
    public static List<UserDTO> fromEntities(List<User> users) {
        return users.stream()
                .map(UserDTO::new)
                .collect(Collectors.toList());
    }
}
