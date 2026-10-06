package com.medicaltransport;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MedicalTransportApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalTransportApplication.class, args);
    }
}
