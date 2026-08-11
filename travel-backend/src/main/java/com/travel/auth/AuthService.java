package com.travel.auth;

import com.travel.security.JwtService;
import com.travel.user.User;
import com.travel.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse loginWithGoogle(String accessToken) {
        GoogleUserInfo info = googleTokenVerifier.verify(accessToken);
        if (info.email() == null || Boolean.FALSE.equals(info.emailVerified())) {
            throw new InvalidGoogleTokenException("Google account has no verified email", null);
        }

        User user = userRepository.findByGoogleId(info.sub())
                .or(() -> userRepository.findByEmail(info.email()))
                .orElseGet(User::new);
        boolean isNewUser = user.getId() == null;

        user.setGoogleId(info.sub());
        user.setEmail(info.email());
        // Only seed the display name from Google on first sign-in — once a user has
        // edited it via updateProfile(), later logins must not silently overwrite it.
        if (isNewUser) {
            user.setName(info.name());
        }
        user.setGivenName(info.givenName());
        user.setFamilyName(info.familyName());
        user.setPictureUrl(info.picture());
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, UserDto.from(user));
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));
        return UserDto.from(user);
    }

    @Transactional
    public UserDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        return UserDto.from(userRepository.save(user));
    }
}
