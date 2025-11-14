package com.example.validation;

public interface GenericValidator<T> {
    void validate(T object) throws Exception;
}
