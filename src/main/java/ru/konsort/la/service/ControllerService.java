package ru.konsort.la.service;

import org.springframework.stereotype.Service;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.web.connection.WsConnection;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by turov on 13.02.2017.
 */
@Service
public class ControllerService {
    private static volatile ControllerService instance;
    private HttpLocalService httpLocalService = new HttpLocalServiceImpl();
    private Map<String, String> registerUrlMap = new HashMap<>();



    public static ControllerService getInstance() {
        ControllerService localInstance = instance;
        if (localInstance == null) {
            synchronized (ControllerService.class) {
                localInstance = instance;
                if (localInstance == null) {
                    instance = localInstance = new ControllerService();
                }
            }
        }
        return localInstance;
    }

    private ControllerService(){
        registerUrlMap.put("karat_data", "/cgi-bin/current_data.py?get_data=yes");
        registerUrlMap.put("sauter_read_coil", "/cgi-bin/sauter.py?read_coil_57=yes");
        registerUrlMap.put("sauter_read_day_sp_rk1", "/cgi-bin/sauter.py?read_day_sp_rk1=yes");
        registerUrlMap.put("sauter_read_night_sp_rk1", "/cgi-bin/sauter.py?read_night_sp_rk1=yes");

//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                while (true){
//                    String data = getData().toString();
//                    WsConnection.broadcast(data);
//                    System.out.println(data);
//                    try {
//                        Thread.sleep(10*1000);
//                    } catch (InterruptedException e) {
//                        e.printStackTrace();
//                    }
//                }
//            }
//        }).start();
    }

    public RegisterData getData(String elementName) {

        //MOCKS
        Map<String, RegisterData> registerDataMap = new HashMap<>();
        int i = 0;
        for (String s :registerUrlMap.keySet()){
            i++;
            if (s.equals("sauter_read_coil")){
                i = 1;
            }
            RegisterData registerData = new RegisterData();
            List<String> asdasd = new ArrayList<String>();
            asdasd.add(i+"");
            registerData.setData(asdasd);
            registerDataMap.put(s, registerData);
        }

//        return httpLocalService.getControllerData(elementName);
        return registerDataMap.get(elementName);
    }

    public Map<String, String> getRegisterUrlMap() {
        return registerUrlMap;
    }
}
