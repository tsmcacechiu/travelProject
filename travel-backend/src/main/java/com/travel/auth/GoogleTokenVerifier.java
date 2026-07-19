package com.travel.auth;

import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Verifies a Google OAuth access token by asking Google's own userinfo endpoint who it
 * belongs to. This keeps the trust boundary on the server: a client can only produce a
 * profile for an account it actually authenticated as with Google.
 */
@Service
public class GoogleTokenVerifier {

    private static final String USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestClient restClient = RestClient.create();

    public GoogleUserInfo verify(String accessToken) {
        try {
            return restClient.get()
                    .uri(USERINFO_URL)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                    .retrieve()
                    .body(GoogleUserInfo.class);
        } catch (RestClientException e) {
            throw new InvalidGoogleTokenException("Failed to verify Google access token", e);
        }
    }
}
