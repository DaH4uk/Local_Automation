package ru.konsort.la.model;

import java.util.List;

/**
 * Created by turov on 13.02.2017.
 */
public class RegisterData {
    /**
     * Массив полученных данных
     */
    private List<String> data;
    /**
     * Ошибки при работе с Каратом
     */
    private String errors;

    public List<String> getData() {
        return data;
    }

    public void setData(List<String> data) {
        this.data = data;
    }

    public String getErrors() {
        return errors;
    }

    public void setErrors(String errors) {
        this.errors = errors;
    }
}
