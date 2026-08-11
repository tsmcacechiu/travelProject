package com.travel.countdown;

import com.travel.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * A user's saved "生命倒數" profile — the inputs behind the life-expectancy estimate
 * (lib/lifeExpectancy.ts on the frontend), not the countdown numbers themselves. Remaining
 * time / life-grid cells are always derived from birthDate + lifeExpectancy at render time,
 * so storing them here would just go stale; only the estimator inputs and its result are kept.
 *
 * One row per user: submitting the countdown form again while logged in overwrites this
 * row rather than appending a new one.
 */
@Entity
@Table(name = "lifecycles")
@Getter
@Setter
public class Lifecycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(nullable = false)
    private Integer exerciseFrequency;

    @Column(nullable = false)
    private Boolean hasDisease;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "skip", column = @Column(name = "father_skip")),
            @AttributeOverride(name = "alive", column = @Column(name = "father_alive")),
            @AttributeOverride(name = "age", column = @Column(name = "father_age")),
            @AttributeOverride(name = "hasDisease", column = @Column(name = "father_has_disease"))
    })
    private RelativeInfo father;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "skip", column = @Column(name = "mother_skip")),
            @AttributeOverride(name = "alive", column = @Column(name = "mother_alive")),
            @AttributeOverride(name = "age", column = @Column(name = "mother_age")),
            @AttributeOverride(name = "hasDisease", column = @Column(name = "mother_has_disease"))
    })
    private RelativeInfo mother;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "skip", column = @Column(name = "paternal_grandfather_skip")),
            @AttributeOverride(name = "alive", column = @Column(name = "paternal_grandfather_alive")),
            @AttributeOverride(name = "age", column = @Column(name = "paternal_grandfather_age")),
            @AttributeOverride(name = "hasDisease", column = @Column(name = "paternal_grandfather_has_disease"))
    })
    private RelativeInfo paternalGrandfather;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "skip", column = @Column(name = "paternal_grandmother_skip")),
            @AttributeOverride(name = "alive", column = @Column(name = "paternal_grandmother_alive")),
            @AttributeOverride(name = "age", column = @Column(name = "paternal_grandmother_age")),
            @AttributeOverride(name = "hasDisease", column = @Column(name = "paternal_grandmother_has_disease"))
    })
    private RelativeInfo paternalGrandmother;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "skip", column = @Column(name = "maternal_grandfather_skip")),
            @AttributeOverride(name = "alive", column = @Column(name = "maternal_grandfather_alive")),
            @AttributeOverride(name = "age", column = @Column(name = "maternal_grandfather_age")),
            @AttributeOverride(name = "hasDisease", column = @Column(name = "maternal_grandfather_has_disease"))
    })
    private RelativeInfo maternalGrandfather;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "skip", column = @Column(name = "maternal_grandmother_skip")),
            @AttributeOverride(name = "alive", column = @Column(name = "maternal_grandmother_alive")),
            @AttributeOverride(name = "age", column = @Column(name = "maternal_grandmother_age")),
            @AttributeOverride(name = "hasDisease", column = @Column(name = "maternal_grandmother_has_disease"))
    })
    private RelativeInfo maternalGrandmother;

    /** The estimated life expectancy computed from the fields above at time of save. */
    @Column(nullable = false)
    private Double lifeExpectancy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
