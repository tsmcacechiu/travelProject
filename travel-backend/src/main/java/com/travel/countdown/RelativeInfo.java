package com.travel.countdown;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

/**
 * Mirrors the frontend's RelativeInfo shape (lib/lifeExpectancy.ts) used for each of the
 * six family members factored into the life-expectancy estimate.
 */
@Embeddable
@Getter
@Setter
public class RelativeInfo {

    private Boolean skip;
    private Boolean alive;
    private Integer age;
    private Boolean hasDisease;
}
