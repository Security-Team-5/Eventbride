package com.eventbride.chat;

import com.eventbride.user.User;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRequest {
	private String sender;
	private String receiver;
	private String content;
}
