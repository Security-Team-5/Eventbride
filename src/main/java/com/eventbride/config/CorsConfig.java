package com.eventbride.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedOrigins("http://localhost:5173", "https://ispp-2425-03.ew.r.appspot.com",
                                "http://localhost:8080", "http://localhost:5174",
                                "https://sprint1-dot-ispp-2425-03.ew.r.appspot.com")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}