package com.example.task;

import com.example.validation.GenericConstraintValidator;
import com.example.validation.GenericValidator;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskValidator implements GenericValidator<Task> {
    private final GenericConstraintValidator<Task> constraintValidator;

    @Override
    public void validate(Task task) throws ConstraintViolationException {
        constraintValidator.validate(task);
    }
}
