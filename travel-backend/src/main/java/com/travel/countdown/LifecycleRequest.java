package com.travel.countdown;

import java.time.LocalDate;

/** gender is the lowercase "male" | "female" string used by the frontend's Gender type. */
public record LifecycleRequest(
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
        Double lifeExpectancy
) {
}
