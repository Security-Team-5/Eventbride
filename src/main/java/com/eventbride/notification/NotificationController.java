package com.eventbride.notification;

import java.util.List;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.user.UserRepository;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Notification> getAllNotificationsForUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userRepository.findByUsername(username).isEmpty()) {
            throw new SecurityException("User not found or unauthorized");
        }
        return notificationService.getAllNotificationsForUser(username);
    }
}