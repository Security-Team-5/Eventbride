package com.eventbride.dto;

import java.util.List;

import com.eventbride.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {
    
    private int statusCode;
    private String error;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String message;

    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private Integer telephone;
    private String password;
    private String dni;
    private String profilePicture;
    private String role;

    private User user;
    private List<User> usersList;    
}
