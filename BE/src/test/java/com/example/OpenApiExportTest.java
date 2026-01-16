package com.example;

<<<<<<< HEAD
import java.nio.file.Files;
import java.nio.file.Paths;
=======
>>>>>>> production
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
<<<<<<< HEAD
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("openapi-export")
=======

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;

>>>>>>> production
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class OpenApiExportTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void exportOpenApi() throws Exception {
        String spec = restTemplate.getForObject("/v3/api-docs", String.class);
<<<<<<< HEAD
        Files.writeString(Paths.get("openapi.yaml"), spec);
    }
}
=======
        Files.write(Paths.get("openapi.yaml"), spec.getBytes(StandardCharsets.UTF_8));
    }
}
>>>>>>> production
