package fr.univlyon1.m1if.m1if13.usersspringboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class UsersApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(UsersApplication.class, args);
	}

}
