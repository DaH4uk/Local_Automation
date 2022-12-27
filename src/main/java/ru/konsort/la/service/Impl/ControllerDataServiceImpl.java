package ru.konsort.la.service.Impl;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.konsort.la.service.ControllerDataService;
import ru.konsort.la.service.HttpLocalService;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by turov on 13.02.2017.
 */
@Service
public class ControllerDataServiceImpl implements ControllerDataService {
    private final Map<String, String> registerGetDataMap = new HashMap<>();
    private final Map<String, String> registerSetDataMap = new HashMap<>();
    private String url;
    private final HttpLocalService httpLocalService;
    private final Environment environment;

    public ControllerDataServiceImpl(HttpLocalService httpLocalService, Environment environment) {
        this.httpLocalService = httpLocalService;
        this.environment = environment;
    }


    @PostConstruct
    private void createRegistersMap(){
        this.url = environment.getRequiredProperty("driver.address") + ":" + environment.getRequiredProperty("driver.port");
        /*
          Read data
         */
        registerGetDataMap.put("karat_data", "current_data.py?get_data=yes");
        registerGetDataMap.put("sauter_read_coil", "sauter.py?read_coil_57=yes");
        registerGetDataMap.put("sauter_read_day_sp_rk1", "sauter.py?read_day_sp_rk1=yes");
        registerGetDataMap.put("sauter_read_night_sp_rk1", "sauter.py?read_night_sp_rk1=yes");
        registerGetDataMap.put("sauter_get_control_rk1", "sauter.py?get_control_rk1=yes");
        registerGetDataMap.put("sauter_get_time", "sauter.py?get_time=yes");
        /*
         * Set data
         */
        registerSetDataMap.put("day_setpoint_rk1", "sauter.py?day_setpoint_rk1");
        registerSetDataMap.put("night_setpoint_rk1", "sauter.py?night_setpoint_rk1");
        registerSetDataMap.put("write_coil_57", "sauter.py?write_coil_57");
        registerSetDataMap.put("control_rk1", "sauter.py?control_rk1");
    }

    public String getData(String elementName) {
        String urlPart = registerGetDataMap.get(elementName);
        return httpLocalService.getControllerData(url + "/cgi-bin/" + urlPart);
    }

    public String setData(String elementName, String value){
        String urlPart = registerSetDataMap.get(elementName)+ "=" + value;
        String registerData = httpLocalService.getControllerData(url + "/cgi-bin/" + urlPart);
         JsonParser parser = new JsonParser();
         JsonElement errors = parser.parse(registerData).getAsJsonObject().get("Error");
        if (errors.isJsonNull()){
            return "{\"Error\": \"\"}";
        } else {
            return registerData;
        }
    }

    public Map<String, String> getRegisterUrlMap() {
        return registerGetDataMap;
    }
}
