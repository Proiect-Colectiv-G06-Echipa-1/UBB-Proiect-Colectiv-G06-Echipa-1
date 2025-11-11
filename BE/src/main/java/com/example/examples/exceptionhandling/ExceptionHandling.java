package com.example.examples.exceptionhandling;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/example/exceptionhandling")
public class ExceptionHandling {
    @PostMapping("/{number}")
    public ResponseEntity<Boolean> getBoolean(@PathVariable Integer number) {
        if (number % 2 == 0) {
            throw new IllegalArgumentException("I can't be even with y'all");
        }
        return ResponseEntity.ok(true);
    }
}
