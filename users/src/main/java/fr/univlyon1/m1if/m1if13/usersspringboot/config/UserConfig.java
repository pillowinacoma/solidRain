package fr.univlyon1.m1if.m1if13.usersspringboot.config;

import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.thymeleaf.spring5.SpringTemplateEngine;
import org.thymeleaf.spring5.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

@EnableWebMvc
@Configuration
public class UserConfig implements WebMvcConfigurer {

    public static final String MEDIA_TYPE_JSON  = "application/json";


    @Bean
    public UserDao userDaoConf(){
        return new UserDao();
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        configurer.defaultContentType(MediaType.valueOf(MEDIA_TYPE_JSON));
    }
}
