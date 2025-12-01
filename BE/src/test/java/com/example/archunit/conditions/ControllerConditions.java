package com.example.archunit.conditions;

import static com.example.archunit.predicates.ExtraPredicates.methodAnnotatedWithAny;

import com.tngtech.archunit.core.domain.JavaMethod;
import com.tngtech.archunit.lang.ArchCondition;
import com.tngtech.archunit.lang.ConditionEvents;
import com.tngtech.archunit.lang.SimpleConditionEvent;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.*;

public class ControllerConditions {
    public static ArchCondition<JavaMethod> methodMustBeARequestHandler() {
        return new ArchCondition<>("be a request handler") {
            @Override
            public void check(JavaMethod method, ConditionEvents events) {
                if (!methodAnnotatedWithAny(
                                GetMapping.class,
                                PostMapping.class,
                                PutMapping.class,
                                DeleteMapping.class,
                                PatchMapping.class)
                        .test(method)) {
                    events.add(SimpleConditionEvent.violated(
                            method,
                            String.format(
                                    "Method %s in %s is not annotated with a mapping annotation",
                                    method.getName(), method.getOwner().getName())));
                }
            }
        };
    }

    public static ArchCondition<JavaMethod> requestHandlerMustBeDocumented() {
        return new ArchCondition<>("be documented") {
            @Override
            public void check(JavaMethod method, ConditionEvents events) {
                if (!method.isAnnotatedWith(Operation.class) || !method.isAnnotatedWith(ApiResponses.class)) {
                    events.add(SimpleConditionEvent.violated(
                            method,
                            String.format(
                                    "Method %s in %s is not annotated with OpenAPI spec annotations",
                                    method.getName(), method.getOwner().getName())));
                }
            }
        };
    }
}
