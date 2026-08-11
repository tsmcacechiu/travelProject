package com.travel.countdown;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/countdown/lifecycle")
@RequiredArgsConstructor
public class LifecycleController {

    private final LifecycleService lifecycleService;

    @GetMapping
    public ResponseEntity<LifecycleDto> get(Authentication authentication) {
        return lifecycleService.findForUser(authentication.getName())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<LifecycleDto> save(Authentication authentication, @RequestBody LifecycleRequest request) {
        return ResponseEntity.ok(lifecycleService.save(authentication.getName(), request));
    }
}
