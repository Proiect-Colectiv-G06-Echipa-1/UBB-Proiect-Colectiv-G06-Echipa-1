package com.example.archunit.conditions;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaField;
import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import java.util.HashSet;
import java.util.Set;

public class GeneralConditions {
    public static ArchCondition<JavaMethod> methodDoesNotBelongToRecord() {
        return new ArchCondition<>("declare no methods") {
            @Override
            public void check(JavaMethod method, ConditionEvents events) {
                if (method.getOwner().isRecord()) {
                    events.add(SimpleConditionEvent.violated(
                            method,
                            String.format(
                                    "Record %s should not declare methods, found %s",
                                    method.getOwner().getName(), method.getName())));
                }
            }
        };
    }

    public static ArchCondition<JavaField> fieldDoesNotBelongToInterface() {
        return new ArchCondition<>("declare no fields") {
            @Override
            public void check(JavaField field, ConditionEvents events) {
                if (field.getOwner().isInterface()) {
                    events.add(SimpleConditionEvent.violated(
                            field,
                            String.format(
                                    "Interface %s should not declare fields, found %s",
                                    field.getOwner().getName(), field.getName())));
                }
            }
        };
    }

    public static ArchCondition<JavaField> fieldMustBeAnInterface() {
        return new ArchCondition<>("be declared as an interface") {
            @Override
            public void check(JavaField field, ConditionEvents events) {
                if (!field.getRawType().isInterface()) {
                    events.add(SimpleConditionEvent.violated(
                            field,
                            String.format(
                                    "Field %s is not an interface, class %s is not an interface",
                                    field.getName(), field.getRawType().getName())));
                }
            }
        };
    }

    public static ArchCondition<JavaClass> classHasOnlyGettersAndSettersForAllFields() {
        return new ArchCondition<>("have only getters and setters matching field names") {
            @Override
            public void check(JavaClass clazz, ConditionEvents events) {
                Set<String> allowedMethods = new HashSet<>();
                clazz.getFields().forEach(field -> {
                    String fieldName = field.getName();
                    String capitalizedFieldName = Character.toUpperCase(fieldName.charAt(0)) + fieldName.substring(1);

                    String getterName = "get" + capitalizedFieldName;
                    String setterName = "set" + capitalizedFieldName;
                    allowedMethods.add(getterName);
                    allowedMethods.add(setterName);

                    var getter = clazz.tryGetMethod(getterName);
                    var setter = clazz.tryGetMethod(setterName, fieldName);

                    if (getter.isEmpty()) {
                        events.add(SimpleConditionEvent.violated(
                                clazz,
                                String.format(
                                        "Field %s in class %s has no getter named %s",
                                        fieldName, clazz.getName(), getterName)));
                    }
                    if (setter.isEmpty()) {
                        events.add(SimpleConditionEvent.violated(
                                clazz,
                                String.format(
                                        "Field %s in class %s has no setter named %s",
                                        fieldName, clazz.getName(), setterName)));
                    }
                });
                clazz.getMethods().forEach(method -> {
                    if (!allowedMethods.contains(method.getName())) {
                        events.add(SimpleConditionEvent.violated(
                                clazz,
                                String.format(
                                        "Class %s contains a method that's not a getter / setter: %s",
                                        clazz.getName(), method.getName())));
                    }
                });
            }
        };
    }
}
