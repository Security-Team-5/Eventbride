package com.eventbride.chat;

import com.eventbride.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<ChatMessage, Long> {

	@Query("SELECT m FROM ChatMessage m WHERE " +
		"(m.sender.id = :user1 AND m.receiver.id = :user2) OR " +
		"(m.sender.id = :user2 AND m.receiver.id = :user1) " +
		"ORDER BY m.timestamp ASC")
	List<ChatMessage> findMessagesBetweenUsers(@Param("user1") Integer user1,
											   @Param("user2") Integer user2);

	@Query("SELECT m FROM ChatMessage m " +
		"WHERE (m.sender = :user1 AND m.receiver = :user2) " +
		"   OR (m.sender = :user2 AND m.receiver = :user1) " +
		"ORDER BY m.timestamp ASC")
	List<ChatMessage> findMessagesBetweenUsers2(@Param("user1") User user1, @Param("user2") User user2);

	@Query("SELECT m FROM ChatMessage m WHERE m.sender = :user OR m.receiver = :user ORDER BY m.timestamp DESC")
	List<ChatMessage> findAllMessagesForUser(@Param("user") User user);
	


}
