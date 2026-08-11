package com.travel.countdown;

public record RelativeInfoDto(Boolean skip, Boolean alive, Integer age, Boolean hasDisease) {

    public static RelativeInfoDto from(RelativeInfo info) {
        if (info == null) return null;
        return new RelativeInfoDto(info.getSkip(), info.getAlive(), info.getAge(), info.getHasDisease());
    }

    public RelativeInfo toEntity() {
        RelativeInfo info = new RelativeInfo();
        info.setSkip(skip);
        info.setAlive(alive);
        info.setAge(age);
        info.setHasDisease(hasDisease);
        return info;
    }
}
