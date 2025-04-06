package com.eventbride.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.eventbride.user.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserChatDTO {
    private Integer id;
    private String username;
    private String profilePicture;

    public UserChatDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.profilePicture = user.getProfilePicture();
    }
    public static UserChatDTO fromEntity(User user) {
        return new UserChatDTO(user);
    }

    public static List<UserChatDTO> fromEntities(List<User> users) {
        return users.stream()
                .map(UserChatDTO::new)
                .collect(Collectors.toList());
    }
}
