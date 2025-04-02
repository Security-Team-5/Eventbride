package com.eventbride.notification;

import java.util.List;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<Notification> getAllNotificationsForUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return notificationService.getAllNotificationsForUser(username);
    }
}
