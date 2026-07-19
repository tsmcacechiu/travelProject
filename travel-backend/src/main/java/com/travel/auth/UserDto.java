package com.travel.auth;

import com.travel.user.User;

public record UserDto(
        Long id,
        String email,
        String name,
        String givenName,
        String familyName,
        String pictureUrl
) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getGivenName(),
                user.getFamilyName(),
                user.getPictureUrl()
        );
    }
}
