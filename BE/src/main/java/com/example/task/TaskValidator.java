package com.example.task;

import com.example.validation.GenericValidator;
import jakarta.validation.ConstraintViolationException;

public interface TaskValidator extends GenericValidator<Task> {
    @Override
    void validate(Task task) throws ConstraintViolationException;
}
