package com.example;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OpenApiExportTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void exportOpenApi() throws Exception {
        String spec = restTemplate.getForObject("/v3/api-docs", String.class);
        Files.write(Paths.get("openapi.yaml"), spec.getBytes(StandardCharsets.UTF_8));
    }
}