package com.example.utils;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.lang.reflect.Field;
import org.hibernate.validator.constraints.Length;

public class AnnotationReader {
    public static int tryGetMinValue(Field field, int defaultMin) {
        var annotation = field.getAnnotation(Min.class);
        return Math.toIntExact(annotation != null ? annotation.value() : defaultMin);
    }

    public static int tryGetMaxValue(Field field, int defaultMax) {
        var annotation = field.getAnnotation(Max.class);
        return Math.toIntExact(annotation != null ? annotation.value() : defaultMax);
    }

    public static int tryGetMinLength(Field field, int defaultMinLength) {
        var annotation = field.getAnnotation(Length.class);
        return annotation != null ? annotation.min() : defaultMinLength;
    }

    public static int tryGetMaxLength(Field field, int defaultMaxLength) {
        var annotation = field.getAnnotation(Length.class);
        return annotation != null ? annotation.max() : defaultMaxLength;
    }
}
