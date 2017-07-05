package ru.konsort.la.service;

import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by turov on 06.05.2017.
 */
@Service
public interface ControllerDataService {
    String getData(String elementName);

    String setData(String elementName, String value);

    Map<String, String> getRegisterUrlMap();
}
