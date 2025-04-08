package com.eventbride.dto;

import com.eventbride.invitation.Invitation;
import com.eventbride.invitation.Invitation.InvitationType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class InvitationDTO {

    private Integer id;
    private String firstName;
    private String lastName;
    private Integer numberOfGuests;
    private Integer maxGuests;
    private Integer telephone;
    private String email;
    private InvitationType invitationType;
    private String eventName;

    // Constructor que convierte una entidad Invitation a DTO
    public InvitationDTO(Invitation invitation) {
        this.id = invitation.getId();
        this.firstName = invitation.getFirstName();
        this.lastName = invitation.getLastName();
        this.numberOfGuests = invitation.getNumberOfGuests();
        this.maxGuests = invitation.getMaxGuests();
        this.email = invitation.getEmail();
        this.invitationType = invitation.getInvitationType();
        this.eventName = invitation.getEvent() != null ? invitation.getEvent().getName() : null;
    }

    // Método para convertir una lista de entidades a una lista de DTOs
    public static List<InvitationDTO> fromEntities(List<Invitation> invitations) {
        return invitations.stream()
                .map(InvitationDTO::new)
                .collect(Collectors.toList());
    }
}
