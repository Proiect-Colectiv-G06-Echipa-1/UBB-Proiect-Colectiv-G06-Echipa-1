package com.example.task;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService service;

    @Operation(summary = "Get all tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        array = @ArraySchema(schema = @Schema(implementation = TaskDTO.class)))})
    })
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @Operation(summary = "Get a task by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task retrieved successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        schema = @Schema(implementation = TaskDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Task not found"),
    })
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.get(id));
    }

    @Operation(summary = "Create a new task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Task created successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        schema = @Schema(implementation = TaskDTO.class))}),
            @ApiResponse(responseCode = "422", description = "Invalid task provided"),
            @ApiResponse(responseCode = "406", description = "Task depends on non-existing parents")
    })
    @PostMapping
    public ResponseEntity<TaskDTO> add(@RequestBody TaskDTO task) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.add(task));
    }

    @Operation(summary = "Update an existing task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task updated successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        schema = @Schema(implementation = TaskDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Task not found"),
            @ApiResponse(responseCode = "406", description = "New task depends on non-existing parents"),
            @ApiResponse(responseCode = "409", description = "New task creates circular dependencies"),
            @ApiResponse(responseCode = "422", description = "Invalid task provided")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> update(@PathVariable Integer id, @RequestBody TaskDTO newTask) {
        return ResponseEntity.ok(service.update(id, newTask));
    }

    @Operation(summary = "Delete a task by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Task deleted successfully"),
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
