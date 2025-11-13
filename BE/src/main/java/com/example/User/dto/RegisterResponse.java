package com.example.User.dto;

public class RegisterResponse {

    private String message;
    private String username;
    private String email;

    public RegisterResponse() {
    }

    public RegisterResponse(String message, String username, String email) {
        this.message = message;
        this.username = username;
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}