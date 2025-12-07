package com.example.User;

import com.example.validation.GenericValidator;
import jakarta.validation.ConstraintViolationException;

public interface UserValidator extends GenericValidator<User> {
    void validate(User user) throws ConstraintViolationException;
}
