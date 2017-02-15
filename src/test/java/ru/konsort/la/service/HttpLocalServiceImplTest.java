package java.ru.konsort.la.service;

import org.junit.jupiter.api.Test;
import ru.konsort.la.service.HttpLocalServiceImpl;

/**
 * Created by turov on 13.02.2017.
 */
class HttpLocalServiceImplTest {
    HttpLocalServiceImpl httpLocalServiceImpl = new HttpLocalServiceImpl();

    @Test
    public void send_get_karat_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet("http://85.26.195.226:8888/cgi-bin/current_data.py?get_data=yes"));
    }

    @Test
    public void send_get_sauter_read_day_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet("http://85.26.195.226:8888/cgi-bin/sauter.py?read_day_sp_rk1=yes"));
    }

    @Test
    public void send_get_sauter_read_night_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet("http://85.26.195.226:8888/cgi-bin/sauter.py?read_night_sp_rk1=yes"));
    }

    @Test
    public void send_get_sauter_read_coil_test() throws Exception {
        System.out.println(httpLocalServiceImpl.sendGet("http://85.26.195.226:8888/cgi-bin/sauter.py?read_coil_57=yes"));
    }

}