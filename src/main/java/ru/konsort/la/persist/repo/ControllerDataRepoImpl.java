package ru.konsort.la.persist.repo;


import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by turov on 06.05.2017.
 */
public class ControllerDataRepoImpl implements ControllerDataRepo {
    /**
     * RegisterName/RegisterValue
     */
    private Map<String, String> registerDataMap = Collections.synchronizedMap(new HashMap<>());

    public void save(String registerName, String registerData){
        registerDataMap.put(registerName, registerData);
    }

    public String findRegisterByName(String registerName){
        return registerDataMap.get(registerName);
    }

    @Override
    public Map<String, String> findAll() {
        return registerDataMap;
    }
}
