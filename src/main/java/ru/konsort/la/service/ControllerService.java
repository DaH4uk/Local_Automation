package ru.konsort.la.service;

import ru.konsort.la.model.RegisterData;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by turov on 13.02.2017.
 */
public class ControllerService {
    private static volatile ControllerService instance;
    private HttpLocalService httpLocalService = new HttpLocalServiceImpl();
    private Map<String, String> registerUrlMap = new HashMap<>();
    private String url;



    public static ControllerService getInstance(String url) {
        ControllerService localInstance = instance;
        if (localInstance == null) {
            synchronized (ControllerService.class) {
                localInstance = instance;
                if (localInstance == null) {
                    instance = localInstance = new ControllerService(url);
                }
            }
        }
        return localInstance;
    }

    private ControllerService(String url){
        this.url = url;
        /**
         * Read data
         */
        registerUrlMap.put("karat_data", "current_data.py?get_data=yes");
        registerUrlMap.put("sauter_read_coil", "sauter.py?read_coil_57=yes");
        registerUrlMap.put("sauter_read_day_sp_rk1", "sauter.py?read_day_sp_rk1=yes");
        registerUrlMap.put("sauter_read_night_sp_rk1", "sauter.py?read_night_sp_rk1=yes");
        /**
         * Set data
         */
        registerUrlMap.put("day_setpoint_rk1", "sauter.py?day_setpoint_rk1");
        registerUrlMap.put("night_setpoint_rk1", "sauter.py?night_setpoint_rk1");
        registerUrlMap.put("write_coil_57", "sauter.py?write_coil_57");
        registerUrlMap.put("control_rk1", "sauter.py?control_rk1");
    }

    public RegisterData getData(String elementName) {
        String urlPart = registerUrlMap.get(elementName);
        return httpLocalService.getControllerData(url + "/cgi-bin/" + urlPart);
    }

    public String setData(String elementName, String value){
        String urlPart = registerUrlMap.get(elementName)+ "=" + value;
        RegisterData registerData = httpLocalService.getControllerData(urlPart);
        if (registerData.getErrors() != null){
            return "{\"Errors\": \"" + registerData.getErrors()+"\"}";
        } else {
            return "{\"Errors\": \"Complete\"}";
        }
    }

    public Map<String, String> getRegisterUrlMap() {
        return registerUrlMap;
    }
}
