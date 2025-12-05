package com.example.boss;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/boss")
@RequiredArgsConstructor
public class BossController {
    private final BossService bossService;

    @Operation(summary = "Get the current boss status")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Boss status retrieved successfully"),
                @ApiResponse(responseCode = "404", description = "Boss not found")
            })
    @GetMapping
    public ResponseEntity<BossDTO> getBoss() {
        return ResponseEntity.ok(bossService.getBoss());
    }

    @Operation(summary = "Update the boss health based on current tasks")
    @ApiResponses(
            value = {
                @ApiResponse(
                        responseCode = "200",
                        description = "Boss updated successfully"),
                @ApiResponse(responseCode = "404", description = "Boss not found")
            })
    @PutMapping
    public ResponseEntity<BossDTO> updateBoss() {
        return ResponseEntity.ok(bossService.updateBoss());
    }
}