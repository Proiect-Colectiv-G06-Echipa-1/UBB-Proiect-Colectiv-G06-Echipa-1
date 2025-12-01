package com.example.archunit.conditions;

import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;

public class EntityConditions {
    public static ArchCondition<JavaClass> mustBelongToPackageHavingMatchingName() {
        return new ArchCondition<>("belong to a package having a matching name") {
            @Override
            public void check(JavaClass clazz, ConditionEvents events) {
                if (!clazz.getPackageName().concat("." + clazz.getSimpleName()).equalsIgnoreCase(clazz.getName())) {
                    events.add(SimpleConditionEvent.violated(
                            clazz,
                            String.format(
                                    "Entity class %s belongs to a package named %s which doesn't match its name",
                                    clazz.getName(), clazz.getPackageName())));
                }
            }
        };
    }
}
