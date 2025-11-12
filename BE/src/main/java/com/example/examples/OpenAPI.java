package com.example.examples;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.IntStream;

@RestController
@RequestMapping("/example/openapi")
public class OpenAPI {
    @Operation(summary = "Get a book by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Integers returned successfully",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Integer.class))})
    })
    @GetMapping
    public ResponseEntity<Integer[]> getAnIntegerArray() {
        return ResponseEntity.ok(IntStream.range(0, 10).boxed().toArray(Integer[]::new));
    }
}
