package com.eventbride.invitation;

import com.eventbride.dto.EventDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InvitationService {

	@Autowired
	private InvitationRepository invitationRepository;

	@Autowired
	private EventRepository eventRepository;

	@Transactional(readOnly = true)
	public Invitation createVoidInvitation(Integer eventId) throws Exception{
		Invitation invitation = new Invitation();
		Optional<Event> event = eventRepository.findById(eventId);

		if (event.isPresent()) {
			invitation.setEvent(event.get());
			invitation.setInvitationType(Invitation.InvitationType.SENT);
		}
		else {
			throw new Exception("Event not found");
		}

		return invitationRepository.save(invitation);
	}

	@Transactional(readOnly = true)
	public Invitation getInvitationById(Integer invitationId) throws Exception{
		Optional<Invitation> invitation = invitationRepository.findById(invitationId);
		if (invitation.isPresent()) {
			return invitation.get();
		}
		else {
			throw new Exception("Invitation not found");
		}
	}

	@Transactional
	public Invitation fillInvitation(Invitation invitation) {
		Invitation existingInvitation = invitationRepository.findById(invitation.getId()).orElse(null);
		BeanUtils.copyProperties(invitation, existingInvitation, "id", "event", "invitationType");
		existingInvitation.setInvitationType(Invitation.InvitationType.RECEIVED);
		// ENVIAR CORREO
		return invitationRepository.save(existingInvitation);
	}

	@Transactional
	public Invitation confirmInvitation(Integer invitationId) throws Exception{
		Optional<Invitation> invitationOptional = invitationRepository.findById(invitationId);
		if (invitationOptional.isPresent()) {
			Invitation invitation = invitationOptional.get();
			invitation.setInvitationType(Invitation.InvitationType.ACCEPTED);
			return invitationRepository.save(invitation);
		}
		else {
			throw new Exception("Invitation not found");
		}
	}

}
