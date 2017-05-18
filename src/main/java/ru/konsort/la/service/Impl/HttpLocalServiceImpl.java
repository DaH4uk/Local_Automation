package ru.konsort.la.service.Impl;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.stereotype.Service;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.service.HttpLocalService;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by turov on 13.02.2017.
 */
@Service
public class HttpLocalServiceImpl implements HttpLocalService {


    // HTTP GET request
    public String sendGet(String urlPart) {

        String url = urlPart;

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

            return response.toString();

        } catch (IOException e) {
            e.printStackTrace();
        }


        return null;
    }

    public String getControllerData(String urlPreset) {
        return sendGet(urlPreset);
    }
}
