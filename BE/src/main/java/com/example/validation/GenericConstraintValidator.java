package com.example.validation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
import org.hibernate.validator.constraints.Length;
import org.springframework.stereotype.Component;

@Component
public class GenericConstraintValidator<T> implements GenericValidator<T> {
    private final Validator validator;

    public GenericConstraintValidator(Validator validator) {
        this.validator = validator;
    }

    @Override
    public void validate(T validationObject) throws ConstraintViolationException {
        Set<ConstraintViolation<T>> totalViolations = validator.validate(validationObject);

        if (!totalViolations.isEmpty()) {
            throw new ConstraintViolationException(formatExceptionMessage(totalViolations), totalViolations);
        }
    }

    // NOTE(DC): I wanted to extract this into a static class and break down the loop into functions for each
    // constraint, but then I realized that I don't know how I'd have one function just for *any other constraints*
    // and make it look pretty so here we are
    private String formatExceptionMessage(Set<ConstraintViolation<T>> violations) {
        var exceptionMessage = new StringBuilder();
        var lengthMismatchExceptions = new StringBuilder();
        var absentFieldExceptions = new StringBuilder();
        var valueRangeExceptions = new StringBuilder();
        violations.forEach(violation -> {
            switch (violation.getConstraintDescriptor().getAnnotation()) {
                case Length _ -> {
                    lengthMismatchExceptions.append(violation.getMessage()).append('\n');
                }
                case NotNull _ -> {
                    absentFieldExceptions.append(violation.getPropertyPath()).append('\n');
                }
                case Min _, Max _ -> {
                    valueRangeExceptions.append(violation.getMessage()).append('\n');
                }
                default -> {
                    exceptionMessage
                            .append("Anonymous violation found on field ")
                            .append(violation.getPropertyPath())
                            .append("\n");
                }
            }
        });
        if (!lengthMismatchExceptions.isEmpty()) {
            exceptionMessage.append("Field length violations:\n").append(lengthMismatchExceptions);
        }
        if (!absentFieldExceptions.isEmpty()) {
            exceptionMessage.append("Missing fields:\n").append(absentFieldExceptions);
        }
        if (!valueRangeExceptions.isEmpty()) {
            exceptionMessage.append("Value out of range violations:\n").append(valueRangeExceptions);
        }
        return exceptionMessage.toString();
    }
}
