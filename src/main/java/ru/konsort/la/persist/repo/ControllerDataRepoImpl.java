package ru.konsort.la.persist.repo;

import ru.konsort.la.model.RegisterData;

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
    private Map<String, RegisterData> registerDataMap = Collections.synchronizedMap(new HashMap<>());

    public void save(String registerName, RegisterData registerData){
        registerDataMap.put(registerName, registerData);
    }

    public RegisterData findRegisterByName(String registerName){
        return registerDataMap.get(registerName);
    }

    @Override
    public Map<String, RegisterData> findAll() {
        return registerDataMap;
    }
}
