package ru.konsort.la.service;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;
import ru.konsort.la.config.ServiceConfig;
import ru.konsort.la.model.RegisterData;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by turov on 13.02.2017.
 */
@Service
public class HttpLocalServiceImpl implements HttpLocalService {
    private JsonParser parser = new JsonParser();
    private String driverUrl = new ServiceConfig().getDriverAddress();
    private String driverPort = new ServiceConfig().getDriverPort();


    // HTTP GET request
    public synchronized String sendGet(String urlPart) {
        String url = sendGet(driverUrl + ":" + driverPort + urlPart);

        URL obj = null;
        try {
            obj = new URL(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        HttpURLConnection con = null;

        try {
            assert obj != null;
            con = (HttpURLConnection) obj.openConnection();
            System.out.println(con.getConnectTimeout());
            con.setRequestMethod("GET");

        } catch (IOException e) {
            e.printStackTrace();
        }

        assert con != null;
        try (BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()))) {


            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }

            int subElementPosition = response.toString().lastIndexOf("{");

            return response.toString().substring(subElementPosition);

        } catch (IOException e) {
            e.printStackTrace();
        }


        return null;
    }

    public synchronized RegisterData getControllerData(String urlPreset) {
        String jsonString = sendGet(urlPreset);

        JsonObject jsonObject = parser.parse(jsonString).getAsJsonObject();

        RegisterData registerData = new RegisterData();
        List<String> data = new ArrayList<>();
        if (jsonObject.get("Data") != null) {
            if (!jsonObject.get("Data").isJsonNull()) {
                for (JsonElement o : jsonObject.get("Data").getAsJsonArray()) {
                    data.add(o.getAsString());
                }
                registerData.setData(data);
            }
        } else if (jsonObject.get("Value") != null) {
            if (!jsonObject.get("Value").isJsonNull()) {
                data.add(jsonObject.get("Value").getAsString());
                registerData.setData(data);
            }
        }

            if (!jsonObject.get("Error").isJsonNull()) {
                registerData.setErrors(jsonObject.get("Error").getAsString());
            }

            return registerData;
        }
    }
