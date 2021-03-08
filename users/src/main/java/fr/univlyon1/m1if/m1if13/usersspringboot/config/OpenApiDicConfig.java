package fr.univlyon1.m1if.m1if13.usersspringboot.config;

import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiDicConfig {
   @Bean
   public GroupedOpenApi userOpenApi(){
      String packagesToScan[] = {"fr.univlyon1.m1if.m1if13.usersspringboot.controller"};
      return GroupedOpenApi.builder().group("users").packagesToScan(packagesToScan).build();
   }
}
