package ru.konsort.la.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.resource.GzipResourceResolver;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceUrlEncodingFilter;
import ru.konsort.la.persist.repo.ControllerDataRepo;
import ru.konsort.la.persist.repo.ControllerDataRepoImpl;
import ru.konsort.la.service.ControllerDataService;
import ru.konsort.la.service.HttpLocalService;
import ru.konsort.la.service.Impl.ControllerDataServiceImpl;
import ru.konsort.la.service.Impl.HttpLocalServiceImpl;
import ru.konsort.la.service.Impl.WebSocketClientServiceImpl;
import ru.konsort.la.service.WebSocketClientService;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import javax.servlet.ServletContext;

@Configuration
@Import({SecurityConfig.class, WebSocketConfig.class, SchedulingConfig.class})
@EnableWebMvc
@EnableSwagger2
@ComponentScan(basePackages = { "ru.konsort.la.web.controller"})
public class MvcConfig extends WebMvcConfigurerAdapter {

    @Bean
    public ResourceUrlEncodingFilter resourceUrlEncodingFilter() {
        return new ResourceUrlEncodingFilter();
    }


    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/vendor/**")
                .addResourceLocations("/resources/vendor/")
                .setCachePeriod(0)
                .resourceChain(true)
                .addResolver(new GzipResourceResolver())
                .addResolver(new PathResourceResolver());
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
        configurer.enable();
    }


    @Bean(name = "messageSource")
    public ReloadableResourceBundleMessageSource getMessageSource() {
        ReloadableResourceBundleMessageSource resource = new ReloadableResourceBundleMessageSource();
        resource.setBasename("classpath:messages");
        resource.setDefaultEncoding("UTF-8");
        return resource;
    }

    @Bean(name = "multipartResolver")
    public CommonsMultipartResolver commonsMultipartResolver(ServletContext servletContext){
        CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver(servletContext);
        commonsMultipartResolver.setMaxInMemorySize(1052428800);
        commonsMultipartResolver.setMaxUploadSize(1052428800);
        return commonsMultipartResolver;
    }
    @Bean(name = "controllerDataRepo")
    public ControllerDataRepo controllerDataRepo(){
        return new ControllerDataRepoImpl();
    }

    @Bean(name = "controllerService")
    public ControllerDataService controllerService() {
        return new ControllerDataServiceImpl();
    }

    @Bean(name = "httpLocalService")
    public HttpLocalService httpLocalService(){
        return new HttpLocalServiceImpl();
    }

    @Bean(name = "webSocketClientService")
    public WebSocketClientService webSocketClientService(){
        return new WebSocketClientServiceImpl();
    }





}
