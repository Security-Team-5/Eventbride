package com.eventbride.chat;

import com.eventbride.event.Event;
import com.eventbride.event.EventService;
import com.eventbride.event_properties.EventPropertiesService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

	@Autowired
	private ChatRepository chatRepository;

	@Autowired
	private UserService userService;

	@GetMapping("/conversations")
	public ResponseEntity<?> getUserConversations() {
		Optional<User> currentUserOpt = userService.getUserByUsername(
			SecurityContextHolder.getContext().getAuthentication().getName());

		if (!currentUserOpt.isPresent()) return ResponseEntity.status(401).build();
		User currentUser = currentUserOpt.get();

		List<ChatMessage> allMessages = chatRepository.findAllMessagesForUser(currentUser);

		Map<Integer, ChatMessage> lastMessagesPerUser = new LinkedHashMap<>();

		for (ChatMessage msg : allMessages) {
			User other = msg.getSender().getId().equals(currentUser.getId()) ? msg.getReceiver() : msg.getSender();

			if (!lastMessagesPerUser.containsKey(other.getId())) {
				lastMessagesPerUser.put(other.getId(), msg);
			}
		}

		return ResponseEntity.ok(lastMessagesPerUser.values());
	}




	@GetMapping("/{recieverId}")
	public ResponseEntity<?> findAllMessagesByUsers(@PathVariable Integer recieverId) {

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Optional<User> sender = userService.getUserByUsername(auth.getName());
		Optional<User> reciver = userService.getUserById(recieverId);
		if (!sender.isPresent() || !reciver.isPresent()) {
			return ResponseEntity.notFound().build();
		}

		// List<ChatMessage> messages = chatRepository.findAll().stream().filter(m -> (m.getSender().equals(sender.get()) && m.getReceiver().equals(reciver.get())) || (m.getSender().equals(reciver.get()) && m.getSender().equals(reciver.get()))).collect(Collectors.toList());
		//List<ChatMessage> messages = chatRepository.findMessagesBetweenUsers(recieverId, sender.get().getId());
		// List<ChatMessage> preMessages = chatRepository.findAll();
		// List<ChatMessage> messages = preMessages.stream()
		// 	.filter(m -> (m.getSender().getId().equals(sender.get().getId()) && m.getReceiver().getId().equals(reciver.get().getId())) || (m.getSender().getId().equals(reciver.get().getId()) && m.getSender().getId().equals(reciver.get().getId()))).collect(Collectors.toList());
		List<ChatMessage> messages = chatRepository.findMessagesBetweenUsers2(sender.get(), reciver.get());
		return ResponseEntity.ok(messages);
	}



}
