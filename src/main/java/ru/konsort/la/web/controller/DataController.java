package ru.konsort.la.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.service.ControllerService;
import ru.konsort.la.service.HttpLocalServiceImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by turov on 14.02.2017.
 */
@RestController
public class DataController {
    private ControllerService controllerService = ControllerService.getInstance();
    HttpLocalServiceImpl httpLocalService = new HttpLocalServiceImpl();

    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public List<String> getKaratData(@RequestParam(required = true, value = "element") String elementName){
        return controllerService.getData(elementName).getData();
    }

    @RequestMapping(value = "/set_data", method = RequestMethod.GET)
    public void setData(@RequestParam(required = true, value = "element") String element,
                        @RequestParam(required = true, value = "val") String value){
        Map<String, String> urlMap = new HashMap<>();
        urlMap.put("day_setpoint_rk1", "/cgi-bin/sauter.py?day_setpoint_rk1=");
        urlMap.put("night_setpoint_rk1", "/cgi-bin/sauter.py?night_setpoint_rk1=");
        urlMap.put("write_coil_57", "/cgi-bin/sauter.py?write_coil_57=");
        urlMap.put("control_rk1", "/cgi-bin/sauter.py?control_rk1=");
        httpLocalService.sendGet(urlMap.get(element)+value);
    }

}
