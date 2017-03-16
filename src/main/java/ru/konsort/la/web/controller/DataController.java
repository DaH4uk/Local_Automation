package ru.konsort.la.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.service.ControllerService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by turov on 14.02.2017.
 */
@RestController
public class DataController {
    @Autowired
    private Environment environment;

    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public List<String> getKaratData(@RequestParam(value = "element") String elementName) {
        String driverUrl = environment.getRequiredProperty("driver.address") + ":" + environment.getRequiredProperty("driver.port");
        ControllerService controllerService = ControllerService.getInstance(driverUrl);
        RegisterData data = controllerService.getData(elementName);
        System.out.println("Object: " + elementName);
        System.out.println("Data: " + data.getData());
        System.out.println("Errors: " + data.getErrors());
        if (data.getData() != null) {
            return data.getData();
        } else {
            String error = data.getErrors();
            List<String> e = new ArrayList<>();
            e.add("Error: " + error);
            return e;
        }
    }

    @RequestMapping(value = "/set_data", method = RequestMethod.GET)
    public String setData(@RequestParam(value = "element") String element,
                          @RequestParam(value = "val") String value) {
        String driverUrl = environment.getRequiredProperty("driver.address") + ":" + environment.getRequiredProperty("driver.port");

        ControllerService controllerService = ControllerService.getInstance(driverUrl);

        return controllerService.setData(element, value);
    }

}
