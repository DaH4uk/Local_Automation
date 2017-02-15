package ru.konsort.la.config;




public class ServiceConfig {

    private String driverAddress;
    private String driverPort;

    public ServiceConfig(){
        this.driverAddress = "http://85.26.195.226";
        this.driverPort = "8888";
    }

    public String getDriverAddress() {
        return driverAddress;
    }

    public String getDriverPort() {
        return driverPort;
    }
}
