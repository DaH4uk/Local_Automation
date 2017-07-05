package ru.konsort.la.service;

import org.junit.jupiter.api.Test;
import ru.konsort.la.service.Impl.HttpLocalServiceImpl;

/**
 * Created by turov on 13.02.2017.
 */
class HttpLocalServiceImplTest {
    HttpLocalServiceImpl httpLocalServiceImpl = new HttpLocalServiceImpl();
    private String url = "http://46.146.200.251:8888";

    @Test
    public void send_get_karat_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/current_data.py?get_data=yes"));
    }

    @Test
    public void send_get_sauter_read_day_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/sauter.py?read_day_sp_rk1=yes"));
    }

    @Test
    public void send_get_sauter_read_night_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/sauter.py?read_night_sp_rk1=yes"));
    }

    @Test
    public void send_get_sauter_read_coil_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/sauter.py?read_coil_57=yes"));
    }

    @Test
    public void send_get_sauter_set_day_temp() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/sauter.py?day_setpoint_rk1=25.1"));
    }

    @Test
    public void send_get_sauter_set_night_temp() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/sauter.py?night_setpoint_rk1=25.1"));
    }

    @Test
    public void send_get_sauter_write_coil() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet(url + "/cgi-bin/sauter.py?write_coil_57=0"));
    }

}