package ru.konsort.la.service;

import com.google.gson.Gson;
import com.google.gson.JsonParser;
import org.junit.jupiter.api.Test;
import ru.konsort.la.model.RegisterData;

import java.util.Map;

/**
 * Created by turov on 13.02.2017.
 */
class ControllerServiceTest {
    Gson jsonParser = new Gson();


    @Test
    void getData() {
        ControllerService service = ControllerService.getInstance();

        System.out.println();

        RegisterData serviceMap = service.getData(service.getRegisterUrlMap().get("karat_data"));

        System.out.println(serviceMap);
    }

}