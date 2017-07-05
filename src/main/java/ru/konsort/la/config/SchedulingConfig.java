package ru.konsort.la.config;

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.aop.interceptor.SimpleAsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import ru.konsort.la.service.Impl.RegisterUpdateDataServiceImpl;
import ru.konsort.la.service.RegisterUpdateDataService;

import java.util.concurrent.Executor;

/**
 * Created by turov on 07.05.2017.
 */
@Configuration
@EnableAsync
@EnableScheduling
public class SchedulingConfig implements AsyncConfigurer {

    @Bean(name = "registerUpdateDataService")
    public RegisterUpdateDataService registerUpdateDataService(){
        return new RegisterUpdateDataServiceImpl();
    }


    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(11);
        executor.setThreadNamePrefix("MyExecutor-");
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new SimpleAsyncUncaughtExceptionHandler();
    }
}

