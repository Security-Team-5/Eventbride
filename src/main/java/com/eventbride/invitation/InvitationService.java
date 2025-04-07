package com.eventbride.invitation;

import com.eventbride.dto.EventDTO;
import com.eventbride.dto.InvitationDTO;
import com.eventbride.event.Event;
import com.eventbride.event.EventRepository;
import com.eventbride.user.User;
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
	public Invitation createVoidInvitation(Integer eventId, Integer maxGuests, User user) throws IllegalArgumentException {

		// Comprobamos que en las eventpropeties del evento exista una venue
		Event event = eventRepository.findById(eventId).orElse(null);

		if (event == null) {
			throw new IllegalArgumentException("El evento no existe");
		}

		if(!event.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("El evento no te pertenece");
		}

		boolean hasVenue = event.getEventProperties().stream()
				.anyMatch(eventProperties -> eventProperties.getVenue() != null);

		if (!hasVenue) {
			throw new IllegalArgumentException("No se puede crear una invitación para un evento sin venue");
		}

		Invitation invitation = new Invitation();
		invitation.setMaxGuests(maxGuests);
		String randomEmail = "randomEmail" + Math.random() + "@gmail.com";
		invitation.setEmail(randomEmail);
		invitation.setEvent(event);
		invitation.setInvitationType(Invitation.InvitationType.SENT);

		return invitationRepository.save(invitation);
	}

	public Invitation getInvitationById(Integer invitationId) throws IllegalArgumentException {
		Optional<Invitation> invitationOpt = invitationRepository.findById(invitationId);
	
		if (!invitationOpt.isPresent()) {
			throw new IllegalArgumentException("La invitación no existe");
		}
	
		Invitation invitation = invitationOpt.get();
		Event event = invitation.getEvent();

		return invitation;
	}

	@Transactional
	public Invitation fillInvitation(Invitation invitation) throws IllegalArgumentException {

		Invitation existingInvitation = invitationRepository.findById(invitation.getId()).orElse(null);

		if (invitation.getNumberOfGuests() > existingInvitation.getMaxGuests()) {
			throw new IllegalArgumentException("Se supera el límite de invitados");
		}

		if(existingInvitation.getInvitationType().equals(Invitation.InvitationType.ACCEPTED)) {
			throw new IllegalArgumentException("La invitación ya ha sido aceptada");
		}

		if(invitation.getLastName().trim().equals("") || invitation.getFirstName().trim().equals("")) {
			throw new IllegalArgumentException("Faltan datos en la invitación");
		}

		BeanUtils.copyProperties(invitation, existingInvitation, "id", "event", "invitationType");
		existingInvitation.setInvitationType(Invitation.InvitationType.ACCEPTED);
		// ENVIAR CORREO
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom("eventbride6@gmail.com");
		mailMessage.setTo(existingInvitation.getEmail());
		mailMessage.setSubject("Invitación a evento");
		mailMessage.setText("Hola " + existingInvitation.getFirstName() + " " + existingInvitation.getLastName() +
				". \nHas confirmado tu asistencia al evento: " + existingInvitation.getEvent().getName() +
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
	public List<InvitationDTO> getInvitationByEventId(Integer eventId, User user) throws IllegalArgumentException {

		Event event = eventRepository.findById(eventId).orElse(null);

		if(event == null) {
			throw new IllegalArgumentException("El evento no existe");
		}

		if(!event.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("El evento no te pertenece");
		}
		List<Invitation> invitations = invitationRepository.findByEventId(eventId);
		return InvitationDTO.fromEntities(invitations);
	}

	@Transactional(readOnly = true)
	public List<Invitation> getInvitationByEventIdNotDTO(Integer eventId, User user) throws IllegalArgumentException {

		Event event = eventRepository.findById(eventId).orElse(null);

		if(event == null) {
			throw new IllegalArgumentException("El evento no existe");
		}

		if(!event.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("El evento no te pertenece");
		}
		List<Invitation> invitations = invitationRepository.findByEventId(eventId);
		return invitations;
	}

	public void deleteInvitations(List<Invitation> i) {
		invitationRepository.deleteAll(i);
	}

	public void deleteInvitationById(Integer invitationId, User user) throws IllegalArgumentException{
		Invitation invitation = invitationRepository.findById(invitationId).orElse(null);

		if(invitation == null){
			throw new IllegalArgumentException("La invitación no existe");
		}

		if(!invitation.getEvent().getUser().getId().equals(user.getId())){
			throw new IllegalArgumentException("No tienes permiso para eliminar esta invitación");
		}

		invitationRepository.deleteById(invitationId);
	}

}
