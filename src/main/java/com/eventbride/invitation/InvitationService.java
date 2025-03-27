package com.eventbride.invitation;

import com.eventbride.dto.EventDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.task.TaskExecutionProperties.Simple;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;
import java.util.Optional;

@Service
public class InvitationService {

	@Autowired
	private InvitationRepository invitationRepository;

	@Autowired
	private EventRepository eventRepository;

	@Autowired
	private JavaMailSender mailSender;

	@Transactional()
	public Invitation createVoidInvitation(Integer eventId, Integer maxGuests) throws Exception {

		// Comprobamos que en las eventpropeties del evento exista una venue
		Optional<Event> event = eventRepository.findById(eventId);
		if (event.isPresent()) {
			boolean hasVenue = event.get().getEventProperties().stream()
					.anyMatch(eventProperties -> eventProperties.getVenue() != null);
			if (!hasVenue) {
				throw new Exception("No se puede crear una invitación para un evento sin venue");
			}
		} else {
			throw new Exception("Event not found");
		}
		Invitation invitation = new Invitation();
		invitation.setMaxGuests(maxGuests);
		String randomEmail = "randomEmail" + Math.random() + "@gmail.com";
		invitation.setEmail(randomEmail);
		invitation.setEvent(event.get());
		invitation.setInvitationType(Invitation.InvitationType.SENT);

		return invitationRepository.save(invitation);
	}

	@Transactional(readOnly = true)
	public Invitation getInvitationById(Integer invitationId) throws Exception {
		Optional<Invitation> invitation = invitationRepository.findById(invitationId);
		if (invitation.isPresent()) {
			return invitation.get();
		} else {
			throw new Exception("Invitation not found");
		}
	}

	@Transactional
	public Invitation fillInvitation(Invitation invitation) throws Exception {

		Invitation existingInvitation = invitationRepository.findById(invitation.getId()).orElse(null);

		if (invitation.getNumberOfGuests() > existingInvitation.getMaxGuests()) {
			throw new Exception("Se supera el límite de invitados");
		}

		BeanUtils.copyProperties(invitation, existingInvitation, "id", "event", "invitationType");
		existingInvitation.setInvitationType(Invitation.InvitationType.ACCEPTED);
		// ENVIAR CORREO
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom("eventbride6@gmail.com");
		mailMessage.setTo(existingInvitation.getEmail());
		mailMessage.setSubject("Invitación a evento");
		mailMessage.setText("Hola " + existingInvitation.getFirstName() + " " + existingInvitation.getLastName() +
				". \nHas confirmado tu asistencia al evento: " + "existingInvitation.getEvent().getName()" +
				". \nEl evento se llevará a cabo en la fecha: " + existingInvitation.getEvent().getEventDate() +
				", en "
				+ existingInvitation.getEvent().getEventProperties().stream()
						.filter(eventProperties -> eventProperties.getVenue() != null).findFirst().get().getVenue()
						.getName()
				+
				", con dirección "
				+ existingInvitation.getEvent().getEventProperties().stream()
						.filter(eventProperties -> eventProperties.getVenue() != null).findFirst().get().getVenue()
						.getAddress()
				+
				". \nMuchas gracias!");

		mailSender.send(mailMessage);
		;

		return invitationRepository.save(existingInvitation);
	}

	@Transactional(readOnly = true)
	public List<Invitation> getInvitationByEventId(Integer eventId) {
		List<Invitation> invitations = invitationRepository.findByEventId(eventId);
		return invitations;
	}

	public void deleteInvitations(List<Invitation> i) {
		invitationRepository.deleteAll(i);
	}

}
