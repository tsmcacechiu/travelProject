package com.travel.guide;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GuideService {

    private final GuideRepository guideRepository;

    public List<Guide> findAll() {
        return guideRepository.findAll();
    }
}
