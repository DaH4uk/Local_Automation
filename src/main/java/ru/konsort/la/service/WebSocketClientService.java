package ru.konsort.la.service;

import org.springframework.stereotype.Service;


/**
 * Created by turov on 18.05.2017.
 */
@Service
public interface WebSocketClientService {
    void Connect() throws Exception;

    void sendToClients();

    void sendMessage(String msg) throws Exception;

    }
