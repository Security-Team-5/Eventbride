package com.eventbride.invitation;


import com.eventbride.event.Event;
import com.eventbride.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "invitations")
@Getter
@Setter
public class Invitation extends BaseEntity{

    @Column(name = "first_name", nullable = false)
    @NotBlank
    @Size(min = 1, max = 40)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    @NotBlank
	@Size(min = 1, max = 40)
    private String lastName;

    @Column(name = "telephone", nullable = false)
    @NotNull
	@Digits(integer = 9, fraction = 0)
    private Integer telephone;

    @Column(name = "email", nullable = true, unique = true)
    @NotBlank
	@Email
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "invitation_type", nullable = false)
    private InvitationType invitationType;

    public enum InvitationType {
        SENT,
        RECEIVED,
        ACCEPTED
    }

}
