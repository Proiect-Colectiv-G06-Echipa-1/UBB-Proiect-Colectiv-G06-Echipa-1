package com.example.task;

import com.example.validation.GenericConstraintValidator;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TaskValidatorImpl implements TaskValidator {
    private final GenericConstraintValidator<Task> constraintValidator;

    @Override
    public void validate(Task task) throws ConstraintViolationException {
        constraintValidator.validate(task);
    }
}
