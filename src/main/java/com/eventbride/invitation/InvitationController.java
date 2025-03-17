package com.eventbride.invitation;

import com.eventbride.event.Event;
import com.eventbride.otherService.OtherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitation")
public class InvitationController {

	@Autowired
	private InvitationService invitationService;

	@GetMapping("/create/{eventId}")
	public ResponseEntity<?> createInvitation(@RequestParam int id) {
		try {
			Invitation res = invitationService.createVoidInvitation(id);
			return new ResponseEntity<>(res, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<?> getInvitation(@RequestParam int id) {
		try{
			Invitation invitation = invitationService.getInvitationById(id);
			return new ResponseEntity<>(invitation, HttpStatus.OK);
		}
		catch (Exception e){
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping
	public ResponseEntity<?> fillInvitation(@RequestBody @Valid Invitation invitation) {
		Invitation res = invitationService.fillInvitation(invitation);
		return new ResponseEntity<>(res, HttpStatus.CREATED);
	}

	// Cambiar la url para que sea única y no predecible
	// Cambiar una vez que funciona la lógica
	@GetMapping("/confirm/{id}")
	public ResponseEntity<?> confirmInvitation(@PathVariable int id) {
		try {
			Invitation res = invitationService.confirmInvitation(id);
			return new ResponseEntity<>(res, HttpStatus.OK);
		}
		catch (Exception e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
	}
}
