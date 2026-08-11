package com.travel.countdown;

import com.travel.user.User;
import com.travel.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LifecycleService {

    private final LifecycleRepository lifecycleRepository;
    private final UserRepository userRepository;

    public Optional<LifecycleDto> findForUser(String email) {
        return lifecycleRepository.findByUserEmail(email).map(LifecycleDto::from);
    }

    @Transactional
    public LifecycleDto save(String email, LifecycleRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        Lifecycle lifecycle = lifecycleRepository.findByUserEmail(email).orElseGet(Lifecycle::new);
        lifecycle.setUser(user);
        lifecycle.setGender(Gender.valueOf(request.gender().toUpperCase()));
        lifecycle.setBirthDate(request.birthDate());
        lifecycle.setExerciseFrequency(request.exerciseFrequency());
        lifecycle.setHasDisease(request.hasDisease());
        lifecycle.setFather(request.father().toEntity());
        lifecycle.setMother(request.mother().toEntity());
        lifecycle.setPaternalGrandfather(request.paternalGrandfather().toEntity());
        lifecycle.setPaternalGrandmother(request.paternalGrandmother().toEntity());
        lifecycle.setMaternalGrandfather(request.maternalGrandfather().toEntity());
        lifecycle.setMaternalGrandmother(request.maternalGrandmother().toEntity());
        lifecycle.setLifeExpectancy(request.lifeExpectancy());

        return LifecycleDto.from(lifecycleRepository.save(lifecycle));
    }
}
