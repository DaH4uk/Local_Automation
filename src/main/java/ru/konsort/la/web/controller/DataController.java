package ru.konsort.la.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.service.ControllerDataService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by turov on 14.02.2017.
 */
@RestController
public class DataController {
    @Autowired
    private ControllerDataService controllerDataService;


    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public String getKaratData(@RequestParam(value = "element") String elementName) {
        return controllerDataService.getData(elementName);
    }

    @RequestMapping(value = "/set_data", method = RequestMethod.GET)
    public String setData(@RequestParam(value = "element") String element,
                          @RequestParam(value = "val") String value) {
        return controllerDataService.setData(element, value);
    }

}
