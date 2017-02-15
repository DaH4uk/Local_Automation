package ru.konsort.la.service;

import ru.konsort.la.model.RegisterData;

/**
 * Created by turov on 13.02.2017.
 */
public interface HttpLocalService {
    RegisterData getControllerData(String urlPreset);
}
