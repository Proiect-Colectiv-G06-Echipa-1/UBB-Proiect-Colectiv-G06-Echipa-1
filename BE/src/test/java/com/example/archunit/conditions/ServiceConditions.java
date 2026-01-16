package com.example.archunit.conditions;

import com.tngtech.archunit.core.domain.JavaField;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

public class ServiceConditions {
    public static ArchCondition<JavaField> mustNotHaveNonMatchingRepositories() {
        return new ArchCondition<>("be a repository matching the service name") {
            @Override
            public void check(JavaField field, ConditionEvents events) {
                String ownerTypeName = field.getOwner().getSimpleName();
                String fieldTypeName = field.getRawType().getSimpleName();

                boolean isFieldARepository = fieldTypeName.endsWith("Repository");
                boolean isFieldAMatchingRepository = fieldTypeName.equals(
                        ownerTypeName.substring(0, ownerTypeName.indexOf("Service")) + "Repository");

                if (isFieldARepository && !isFieldAMatchingRepository) {
                    events.add(SimpleConditionEvent.violated(
                            field,
                            String.format(
                                    "Field %s in %s has type %s which is not allowed",
                                    field.getName(), ownerTypeName, fieldTypeName)));
                }
            }
        };
    }
}
