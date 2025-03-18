package com.eventbride.invitation;


import com.eventbride.event.Event;
import com.eventbride.model.BaseEntity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "invitations")
@Getter
@Setter
public class Invitation extends BaseEntity{

    @Column(name = "first_name")
    @NotBlank
    @Size(min = 1, max = 40)
    private String firstName;

    @Column(name = "last_name")
    @NotBlank
	@Size(min = 1, max = 40)
    private String lastName;

	@Column(name = "number_of_guests")
	private Integer numberOfGuests;

    @Column(name = "telephone")
    @NotNull
	@Digits(integer = 9, fraction = 0)
    private Integer telephone;

    @Column(name = "email", unique = true)
    @NotBlank
	@Email
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "invitation_type")
    private InvitationType invitationType;

    public enum InvitationType {
        SENT,
        RECEIVED,
        ACCEPTED
    }

	@ManyToOne()
	@JoinColumn(name = "event_id")
	private Event event;

}
