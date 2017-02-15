package ru.konsort.la.web.connection;


import ru.konsort.la.service.ControllerService;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.ArrayBlockingQueue;

/**
 * Created by turov on 14.02.2017.
 */
@ServerEndpoint("/websocket")
public class WsConnection {
    private static ArrayBlockingQueue<Session> sessions = new ArrayBlockingQueue<Session>(100);


    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Open Connection ...");
        ControllerService.getInstance();
        sessions.add(session);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("Close Connection ...");
        sessions.remove(session);
    }

    @OnMessage
    public void onMessage(String message) {
        broadcast(message);
    }

    @OnError
    public void onError(Throwable e) {
        e.printStackTrace();
    }

    public static void broadcast(String msg) {
        for (Session s : sessions) {
            if (s != null) {
                try {
                    s.getBasicRemote().sendText(msg);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
    }


}
