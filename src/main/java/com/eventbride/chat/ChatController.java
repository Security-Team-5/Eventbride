package com.eventbride.chat;

import com.eventbride.notification.Notification;
import com.eventbride.notification.NotificationRepository;
import com.eventbride.notification.NotificationService;
import com.eventbride.user.User;
import com.eventbride.user.UserService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Controller
public class ChatController {

	private final ChatRepository repository;
	private final SimpMessagingTemplate messagingTemplate;
	private final UserService userService;
	private final NotificationService notificationService;
	private final NotificationRepository notificationRepository;

	@Autowired
	public ChatController(SimpMessagingTemplate messagingTemplate, ChatRepository repo, UserService userService, NotificationService notificationService, NotificationRepository notificationRepository) {
		this.messagingTemplate = messagingTemplate;
		this.repository = repo;
		this.userService = userService;
		this.notificationService = notificationService;
		this.notificationRepository = notificationRepository;
	}

	@MessageMapping("/chat.private")
	public void sendPrivateMessage(ChatMessageRequest message) {
		ChatMessage messageToSave = new ChatMessage();
		messageToSave.setTimestamp(LocalDateTime.now());
		Optional<User> receiver = userService.getUserByUsername(message.getReceiver());
		Optional<User> sender = userService.getUserByUsername(message.getSender());
		if (receiver.isPresent() && sender.isPresent()) {
			messageToSave.setReceiver(receiver.get());
			messageToSave.setSender(sender.get());
		}
		messageToSave.setContent(message.getContent());
		repository.save(messageToSave);
		List<Notification> recentNotifications = notificationRepository.findRecentNewMessageNotificationsByUserId(receiver.get().getId(), LocalDateTime.now().minusMinutes(1));
		if(recentNotifications.isEmpty()) {
			notificationService.createNotification(Notification.NotificationType.NEW_MESSAGE, receiver.get(), null, null, null);
		}
/*
		// Enviar al receptor a su canal personal
		messagingTemplate.convertAndSendToUser(
			message.getReceiver(), 						// receptor
			"/queue/messages",     						// su canal privado
			message
		);*/

		messagingTemplate.convertAndSend(
			"/queue/usuario-" + message.getReceiver(),
			message
		);

	}

}
