package com.vehiclespareparts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

    @Autowired
    private Environment env;

    @PostConstruct
    public void init() {
        System.out.println("MONGO URI: " + env.getProperty("spring.data.mongodb.uri"));
        System.out.println("SERVER PORT: " + env.getProperty("server.port"));
    }

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
}
