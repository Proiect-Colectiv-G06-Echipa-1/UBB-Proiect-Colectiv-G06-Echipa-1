package com.example.archunit;

import static com.example.archunit.predicates.ExtraPredicates.classAnnotatedWithAny;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.simpleNameEndingWith;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;

import com.example.archunit.conditions.ControllerConditions;
import com.example.archunit.conditions.GeneralConditions;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;
import org.mapstruct.Mapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

@AnalyzeClasses(packages = "com.example")
public class CodingConventionsTest {
    @ArchTest
    void spring_component_fields_are_non_static_and_final(JavaClasses classes) {
        ArchRule rule = fields().that()
                .areDeclaredInClassesThat(classAnnotatedWithAny(
                        RestController.class, Service.class, Repository.class, Component.class, Mapper.class))
                .should()
                .notBeStatic()
                .andShould()
                .beFinal()
                .because("of best practices");
        rule.check(classes);
    }

    @ArchTest
    void spring_component_methods_are_non_static(JavaClasses classes) {
        ArchRule rule = methods()
                .that()
                .areDeclaredInClassesThat(classAnnotatedWithAny(
                        RestController.class, Service.class, Repository.class, Component.class, Mapper.class))
                .should()
                .notBeStatic()
                .because("of best practices");
        rule.check(classes);
    }

    @ArchTest
    void controllers_return_only_response_entities(JavaClasses classes) {
        ArchRule rule = methods()
                .that()
                .areDeclaredInClassesThat()
                .areAnnotatedWith(RestController.class)
                .should()
                .haveRawReturnType(ResponseEntity.class)
                .because("of RESTful design principles");
        rule.check(classes);
    }

    @ArchTest
    void controllers_only_contain_endpoint_methods_and_must_contain_openapi_spec(JavaClasses classes) {
        ArchRule rule = methods()
                .that()
                .areDeclaredInClassesThat()
                .areAnnotatedWith(RestController.class)
                .should(ControllerConditions.methodMustBeARequestHandler())
                .andShould(ControllerConditions.requestHandlerMustBeDocumented())
                .because("controllers must only contain request handlers and they must be documented");
        rule.check(classes);
    }

    @ArchTest
    void controllers_fields_are_only_services(JavaClasses classes) {
        ArchRule rule = fields().that()
                .areDeclaredInClassesThat()
                .areAnnotatedWith(RestController.class)
                .should()
                .haveRawType(simpleNameEndingWith("Service"))
                .because("controllers must only use services and shouldn't have any other logic-related variables");
        rule.check(classes);
    }

    @ArchTest
    void repositories_are_interfaces(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Repository.class)
                .should()
                .beInterfaces()
                .because(
                        "repositories should have no custom defined implementation unless there's a very good reason for it");
        rule.check(classes);
    }

    @ArchTest
    void mappers_are_interfaces(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Mapper.class)
                .should()
                .beInterfaces()
                .because(
                        "mappers should have no custom defined implementation unless there's a very good reason for it");
        rule.check(classes);
    }

    @ArchTest
    void dtos_are_records(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .resideInAPackage("..dto..")
                .or()
                .haveNameMatching(".*DTO")
                .should()
                .beRecords()
                .because("DTOs must be immutable and records are just that: immutable classes");
        rule.check(classes);
    }

    @ArchTest
    void records_do_not_have_methods(JavaClasses classes) {
        ArchRule rule = methods()
                .should(GeneralConditions.methodDoesNotBelongToRecord())
                .because("records should just be immutable data structures");
        rule.check(classes);
    }

    @ArchTest
    void interfaces_do_not_have_member_variables(JavaClasses classes) {
        ArchRule rule = fields().should(GeneralConditions.fieldDoesNotBelongToInterface())
                .because("of best practices");
        rule.check(classes);
    }

    @ArchTest
    void entities_do_not_have_more_than_getters_and_setters(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Entity.class)
                .should(GeneralConditions.classHasOnlyGettersAndSettersForAllFields())
                .because("entities are not supposed to handle logic");
        rule.check(classes);
    }

    @ArchTest
    void controller_and_service_fields_must_be_interfaces(JavaClasses classes) {
        ArchRule rule = fields().that()
                .areDeclaredInClassesThat(classAnnotatedWithAny(RestController.class, Service.class))
                .should(GeneralConditions.fieldMustBeAnInterface())
                .because("of dependency inversion (D from SOLID)");
        rule.check(classes);
    }
}
