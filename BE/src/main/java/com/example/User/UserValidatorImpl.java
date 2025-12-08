package com.example.User;

import com.example.validation.GenericConstraintValidator;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserValidatorImpl implements UserValidator {
    private final GenericConstraintValidator<User> constraintValidator;

    @Override
    public void validate(User user) throws ConstraintViolationException {
        constraintValidator.validate(user);
    }
}
