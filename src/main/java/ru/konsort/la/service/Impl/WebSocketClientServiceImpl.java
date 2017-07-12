package ru.konsort.la.service.Impl;

import com.google.gson.JsonElement;
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
import org.springframework.core.env.Environment;
import org.springframework.messaging.core.MessageSendingOperations;
import org.springframework.stereotype.Service;
import ru.konsort.la.persist.repo.ControllerDataRepo;
import ru.konsort.la.service.WebSocketClientService;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;
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

    @Autowired
    private Environment environment;


    @SuppressWarnings("unused")
    private Session session;

    boolean proxyStatus;


    @OnWebSocketClose
    public void onClose(int statusCode, String reason) throws Exception {
        System.err.printf("Connection closed: %d - %s%n", statusCode, reason);
        this.session = null;
        proxyStatus = false;
        checkProxyConnected();
        Thread.sleep(10000);
        Connect();
    }

    @OnWebSocketConnect
    public void onConnect(Session session) throws IOException {
        System.err.printf("Got connect: %s%n", session);
        this.session = session;
        proxyStatus = true;
        checkProxyConnected();
    }

    @OnWebSocketMessage
    public void onMessage(String msg) {
        System.err.printf("Got msg: %s%n", msg);
        JsonObject jsonObject = null;
        if (!msg.contains("{") && !msg.contains("}")) {
            if (msg.contains("Error")) {
                msg = "{\"error\":  \"" + msg + "\"}";
            } else {
                msg = "{\"value\":  \"" + msg + "\"}";
            }
        }


        jsonObject = (JsonObject) jsonParser.parse(msg);

        if (jsonObject != null && jsonObject.get("Error") != null) {
            jsonObject = (JsonObject) jsonParser.parse(msg);
            parseAndSaveData("Error", jsonObject);
        }


        if (jsonObject != null && jsonObject.get("Value") != null) {
            jsonObject = (JsonObject) jsonParser.parse(msg);
            jsonObject = jsonObject.get("Value").getAsJsonObject();


            parseAndSaveData("AT Heat Off RK1", jsonObject);
            parseAndSaveData("Dial Pause Modem", jsonObject);
            parseAndSaveData("Night setpoint", jsonObject);
            parseAndSaveData("Run-time for actuator", jsonObject);
            parseAndSaveData("Reset time", jsonObject);
            parseAndSaveData("Cyclical init Modem", jsonObject);
            parseAndSaveData("Product number", jsonObject);
            parseAndSaveData("system", jsonObject);
            parseAndSaveData("Error counter", jsonObject);
            parseAndSaveData("Outdoor temp AF1", jsonObject);
            parseAndSaveData("Day setpoint", jsonObject);
            parseAndSaveData("Time-out Modem", jsonObject);
            parseAndSaveData("bit Operating mode", jsonObject);
            parseAndSaveData("Room temp RF1", jsonObject);
            parseAndSaveData("Switch position", jsonObject);
            parseAndSaveData("bit Setpoint value Tf", jsonObject);
            parseAndSaveData("Flow temp VF1", jsonObject);
            parseAndSaveData("Write-enable Modem", jsonObject);
            parseAndSaveData("bit Collective", jsonObject);
            parseAndSaveData("bit Time-out", jsonObject);
            parseAndSaveData("Proportional band", jsonObject);
            parseAndSaveData("bit Dial if error", jsonObject);
            parseAndSaveData("Dial Repeat Modem", jsonObject);
            parseAndSaveData("Min flow temp", jsonObject);
            parseAndSaveData("Firmware version", jsonObject);
            parseAndSaveData("Date", jsonObject);
            parseAndSaveData("Time", jsonObject);
            parseAndSaveData("bit Manual mode", jsonObject);
            parseAndSaveData("Hardware version", jsonObject);
            parseAndSaveData("bit Heating medium pump", jsonObject);
            parseAndSaveData("bit Disable modem", jsonObject);
            parseAndSaveData("Device Status Archive", jsonObject);
            parseAndSaveData("bit Terminal 6", jsonObject);
            parseAndSaveData("Control Signal RK1", jsonObject);
            parseAndSaveData("Flow setpoint", jsonObject);
            parseAndSaveData("Device Status", jsonObject);
            parseAndSaveData("Max flow temp", jsonObject);
            parseAndSaveData("bit Control element", jsonObject);
            parseAndSaveData("Year", jsonObject);
            parseAndSaveData("Mode RK1", jsonObject);
            parseAndSaveData("Slope of heating", jsonObject);
            sendToClients();

        } else {
            String queue = "/data/updater";

            this.messagingTemplate.convertAndSend(queue, msg);
        }

    }

    private void parseAndSaveData(String registerName, JsonObject jsonObject) {
        JsonElement val = jsonObject.get(registerName);
        registerName = registerName.replace(" ", "");
        registerName = registerName.replace("-", "");
        if (val != null && !val.isJsonNull()) {
            controllerDataRepo.save(registerName, val.getAsString());
        }
    }

    public void sendMessage(String msg) throws Exception {
        msg = msg.replace("\"", "");

        if (session == null) {
            Connect();
            Thread.sleep(10000);
        }

        session.getRemote().sendString(msg);
    }

    @PostConstruct
    @Override
    public void Connect() throws Exception {
        this.client = new WebSocketClient();
        client.start();

        URI echoUri = new URI(environment.getProperty("driver.ws"));
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

    public void checkProxyConnected() {
        String queue = "/data/updater";
        String response = "{\"proxyStatus\": " + proxyStatus + "}";
        System.err.println(response);
        this.messagingTemplate.convertAndSend(queue, response);
    }
}
