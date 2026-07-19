package com.travel.auth;

public class InvalidGoogleTokenException extends RuntimeException {
    public InvalidGoogleTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
