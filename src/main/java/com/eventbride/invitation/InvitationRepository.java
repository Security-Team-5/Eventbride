package com.eventbride.invitation;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface InvitationRepository extends CrudRepository<Invitation, Integer> {

    @Query("SELECT invitation FROM Invitation invitation WHERE invitation.event.id = :eventId")
	public List<Invitation> findByEventId(int eventId);
    
}
