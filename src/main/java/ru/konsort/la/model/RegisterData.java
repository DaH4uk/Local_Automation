package ru.konsort.la.model;


/**
 * Created by turov on 13.02.2017.
 */
public class RegisterData {
    /**
     * Массив полученных данных
     */
    private String value;
    private String error;

    public RegisterData(String value, String error) {
        this.value = value;
        this.error = error;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
