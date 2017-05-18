package ru.konsort.la.web.controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.persist.repo.ControllerDataRepo;
import ru.konsort.la.service.ControllerDataService;
import ru.konsort.la.service.RegisterUpdateDataService;
import ru.konsort.la.service.WebSocketClientService;

import java.util.Map;


/**
 * Created by turov on 06.05.2017.
 */
@Controller
public class WebSocketController {

    @Autowired
    private ControllerDataRepo controllerDataRepo;

    @Autowired
    private ControllerDataService controllerDataService;

    @Autowired
    private WebSocketClientService webSocketClientService;


    private JsonParser jsonParser = new JsonParser();


    @MessageMapping("/hello")
    @SendTo("/data/updater")
    public Map<String, RegisterData> greeting(String message) throws Exception {
        return controllerDataRepo.findAll();
    }


    @MessageMapping("/set")
    @SendTo("/data/updater")
    public String setRegisterData(String message) {
        JsonObject jsonObject = (JsonObject) jsonParser.parse(message);
        String element = jsonObject.get("element").getAsString();
        String registerName = "";
        switch (element) {
            case "day_setpoint_rk1":
                registerName = "sauter_read_day_sp_rk1";
                break;
            case "night_setpoint_rk1":
                registerName = "sauter_read_night_sp_rk1";
                break;
            case "write_coil_57":
                registerName = "sauter_read_coil";
                break;
            case "control_rk1":
                registerName = "sauter_get_control_rk1";
                break;
            default:
                break;
        }


        RegisterData registerData = controllerDataRepo.findRegisterByName(registerName);
        if ("1".equals(jsonObject.get("value").getAsString())) {
            registerData.setValue("true");
        } else if ("0".equals(jsonObject.get("value").getAsString())) {
            registerData.setValue("false");
        } else {
            registerData.setValue(jsonObject.get("value").getAsString());
        }
        controllerDataRepo.save(registerName, registerData);
        String res = controllerDataService.setData(jsonObject.get("element").getAsString(), jsonObject.get("value").getAsString());
        webSocketClientService.sendToClients();
        return res;
    }


}
