package com.example.archunit.predicates;

import com.tngtech.archunit.base.DescribedPredicate;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaMethod;
import java.lang.annotation.Annotation;
import java.util.Arrays;

public class ExtraPredicates {
    @SafeVarargs
    public static DescribedPredicate<JavaClass> classAnnotatedWithAny(Class<? extends Annotation>... annotations) {
        return new DescribedPredicate<>("annotated with any of " + Arrays.toString(annotations)) {
            @Override
            public boolean test(JavaClass clazz) {
                return Arrays.stream(annotations).anyMatch(clazz::isAnnotatedWith);
            }
        };
    }

    @SafeVarargs
    public static DescribedPredicate<JavaMethod> methodAnnotatedWithAny(Class<? extends Annotation>... annotations) {
        return new DescribedPredicate<>("annotated with any of " + Arrays.toString(annotations)) {
            @Override
            public boolean test(JavaMethod method) {
                return Arrays.stream(annotations).anyMatch(method::isAnnotatedWith);
            }
        };
    }
}
