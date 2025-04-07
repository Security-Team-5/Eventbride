package com.eventbride.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.eventbride.chat.ChatMessage;
import com.eventbride.event.Event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDTO {
    private Integer id;
    private String content;
    private LocalDateTime timestamp;
    private UserChatDTO sender;
    private UserChatDTO receiver;

    public MessageDTO(ChatMessage message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.timestamp = message.getTimestamp();
        this.sender = new UserChatDTO(message.getSender());
        this.receiver = new UserChatDTO(message.getReceiver());
    }

    public static List<MessageDTO> fromEntities(List<ChatMessage> mssgs) {
        return mssgs.stream()
                .map(MessageDTO::new)
                .toList();
    }
}