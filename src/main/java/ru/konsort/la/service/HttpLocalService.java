package ru.konsort.la.service;

import org.springframework.stereotype.Service;
import ru.konsort.la.model.RegisterData;

/**
 * Created by turov on 13.02.2017.
 */
@Service
public interface HttpLocalService {
    RegisterData getControllerData(String urlPreset);
}
