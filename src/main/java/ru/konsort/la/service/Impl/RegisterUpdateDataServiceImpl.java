package ru.konsort.la.service.Impl;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.persist.repo.ControllerDataRepo;
import ru.konsort.la.service.ControllerDataService;
import ru.konsort.la.service.RegisterUpdateDataService;

import java.util.Map;

/**
 * Created by turov on 06.05.2017.
 */
@Service
public class RegisterUpdateDataServiceImpl implements RegisterUpdateDataService {


    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    public void sendErrorToClient(String registerName, String error) {
        String queue = "/data/errors";
        String json = "{ \"name\":\"" + registerName + "\", \"error\": \"" + error + "\"}";
        System.out.println(json);
        this.messagingTemplate.convertAndSend(queue, json);
    }
}
