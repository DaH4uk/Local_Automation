package ru.konsort.la.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.konsort.la.model.RegisterData;

/**
 * Created by turov on 06.05.2017.
 */
@Service
public interface RegisterUpdateDataService {

    void sendErrorToClient(String name, String error);
}
