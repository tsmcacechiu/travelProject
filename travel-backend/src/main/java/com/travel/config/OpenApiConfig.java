package com.travel.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI travelOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Travel Project API")
                        .description("旅遊知識庫後端 API")
                        .version("v0.1.0"));
    }
}
