package ru.konsort.la.service.Impl;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.client.ClientUpgradeRequest;
import org.eclipse.jetty.websocket.client.WebSocketClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;
import ru.konsort.la.model.RegisterData;
import ru.konsort.la.persist.repo.ControllerDataRepo;
import ru.konsort.la.service.WebSocketClientService;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.net.URI;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Created by turov on 18.05.2017.
 */
@Service
@WebSocket(maxTextMessageSize = 64 * 1024)
public class WebSocketClientServiceImpl implements WebSocketClientService {


    @Autowired
    private ControllerDataRepo controllerDataRepo;

    private JsonParser jsonParser = new JsonParser();

    private WebSocketClient client = new WebSocketClient();

    @Autowired
    private MessageSendingOperations<String> messagingTemplate;

    private final CountDownLatch closeLatch;
    @SuppressWarnings("unused")
    private Session session;

    public WebSocketClientServiceImpl() {
        this.closeLatch = new CountDownLatch(1);
    }

    public boolean awaitClose(int duration, TimeUnit unit) throws InterruptedException {
        return this.closeLatch.await(duration, unit);
    }

    @OnWebSocketClose
    public void onClose(int statusCode, String reason) throws Exception {
        System.err.printf("Connection closed: %d - %s%n", statusCode, reason);
        this.session = null;
        this.closeLatch.countDown(); // trigger latch

        Thread.sleep(10000);
        Connect();
    }

    @OnWebSocketConnect
    public void onConnect(Session session) {
        System.err.printf("Got connect: %s%n", session);
        this.session = session;
    }

    @OnWebSocketMessage
    public void onMessage(String msg) {
        System.err.printf("Got msg: %s%n", msg);
        JsonObject jsonObject = (JsonObject) jsonParser.parse(msg);


        saveAndSendRegisterData("pump_is_on", jsonObject);
        saveAndSendRegisterData("day_sp_rk1", jsonObject);
        saveAndSendRegisterData("night_sp_rk1", jsonObject);
        saveAndSendRegisterData("control_rk1", jsonObject);
        sendToClients();
    }

    private void saveAndSendRegisterData(String registerName, JsonObject jsonObject) {
        JsonObject val = jsonObject.get(registerName).getAsJsonObject();
        String value = "";
        if (!val.get("Value").isJsonNull()){
            value = val.get("Value").getAsString();
        }
        String error = "";
        if (!val.get("Error").isJsonNull()){
            error = val.get("Error").getAsString();
        }
        RegisterData registerData = new RegisterData(value, error);
        String name;
        switch (registerName) {
            case "pump_is_on":
                name = "sauter_read_coil";
                break;
            case "day_sp_rk1":
                name = "sauter_read_day_sp_rk1";
                break;
            case "night_sp_rk1":
                name = "sauter_read_night_sp_rk1";
                break;
            case "control_rk1":
                name = "sauter_get_control_rk1";
                break;
            default:
                name = "";
                break;
        }

        controllerDataRepo.save(name, registerData);

    }

    @PostConstruct
    @Override
    public void Connect() throws Exception {
        WebSocketClient client = new WebSocketClient();
        client.start();

        URI echoUri = new URI("ws://46.146.200.251:8765/");
        ClientUpgradeRequest request = new ClientUpgradeRequest();
        client.connect(this, echoUri, request);
        System.err.printf("Connecting to : %s%n", echoUri);
    }

    @PreDestroy
    private void Close() throws Exception {
        client.stop();
    }


    public void sendToClients() {
        String queue = "/data/updater";
        this.messagingTemplate.convertAndSend(queue, controllerDataRepo.findAll());
    }
}
