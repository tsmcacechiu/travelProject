package com.travel.auth;

public record AuthResponse(String token, UserDto user) {
}
