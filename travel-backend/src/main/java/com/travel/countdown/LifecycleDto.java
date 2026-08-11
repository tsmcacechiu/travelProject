package com.travel.countdown;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LifecycleDto(
        String gender,
        LocalDate birthDate,
        Integer exerciseFrequency,
        Boolean hasDisease,
        RelativeInfoDto father,
        RelativeInfoDto mother,
        RelativeInfoDto paternalGrandfather,
        RelativeInfoDto paternalGrandmother,
        RelativeInfoDto maternalGrandfather,
        RelativeInfoDto maternalGrandmother,
        Double lifeExpectancy,
        LocalDateTime updatedAt
) {
    public static LifecycleDto from(Lifecycle l) {
        return new LifecycleDto(
                l.getGender().name().toLowerCase(),
                l.getBirthDate(),
                l.getExerciseFrequency(),
                l.getHasDisease(),
                RelativeInfoDto.from(l.getFather()),
                RelativeInfoDto.from(l.getMother()),
                RelativeInfoDto.from(l.getPaternalGrandfather()),
                RelativeInfoDto.from(l.getPaternalGrandmother()),
                RelativeInfoDto.from(l.getMaternalGrandfather()),
                RelativeInfoDto.from(l.getMaternalGrandmother()),
                l.getLifeExpectancy(),
                l.getUpdatedAt()
        );
    }
}
