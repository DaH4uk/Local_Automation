package ru.konsort.la.persist.repo;

import ru.konsort.la.model.RegisterData;

import java.util.Map;

/**
 * Created by turov on 06.05.2017.
 */
public interface ControllerDataRepo {
    void save(String registerName, String registerData);

    String findRegisterByName(String registerName);

    Map<String, String> findAll();
}
