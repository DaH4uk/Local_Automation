package ru.konsort.la.dto;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Created by turov on 08.05.2017.
 */
public class RegisterDataDto {
    private Map<String, BigDecimal> karatData;
    private BigDecimal sauterNightTemp;
    private BigDecimal sauterDayTemp;
    private Boolean sauterCoil;
    private BigDecimal sauterControlValue;
    private String sauterTime;
    private Map<String, String> errorsMap;

    public Map<String, BigDecimal> getKaratData() {
        return karatData;
    }

    public void setKaratData(Map<String, BigDecimal> karatData) {
        this.karatData = karatData;
    }

    public BigDecimal getSauterNightTemp() {
        return sauterNightTemp;
    }

    public void setSauterNightTemp(BigDecimal sauterNightTemp) {
        this.sauterNightTemp = sauterNightTemp;
    }

    public BigDecimal getSauterDayTemp() {
        return sauterDayTemp;
    }

    public void setSauterDayTemp(BigDecimal sauterDayTemp) {
        this.sauterDayTemp = sauterDayTemp;
    }

    public boolean isSauterCoil() {
        return sauterCoil;
    }

    public void setSauterCoil(boolean sauterCoil) {
        this.sauterCoil = sauterCoil;
    }

    public Map<String, String> getErrorsMap() {
        return errorsMap;
    }

    public void setErrorsMap(Map<String, String> errorsMap) {
        this.errorsMap = errorsMap;
    }

    public Boolean getSauterCoil() {
        return sauterCoil;
    }

    public void setSauterCoil(Boolean sauterCoil) {
        this.sauterCoil = sauterCoil;
    }

    public BigDecimal getSauterControlValue() {
        return sauterControlValue;
    }

    public void setSauterControlValue(BigDecimal sauterControlValue) {
        this.sauterControlValue = sauterControlValue;
    }

    public String getSauterTime() {
        return sauterTime;
    }

    public void setSauterTime(String sauterTime) {
        this.sauterTime = sauterTime;
    }
}
