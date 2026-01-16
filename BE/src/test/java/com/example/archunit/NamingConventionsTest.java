package com.example.archunit;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.example.archunit.conditions.EntityConditions;
import com.example.validation.GenericValidator;
import com.tngtech.archunit.core.domain.JavaClass;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

@AnalyzeClasses(packages = "com.example", importOptions = ImportOption.DoNotIncludeTests.class)
public class NamingConventionsTest {
    // NOTE(DC): Not a pure archtest, but this is the only way I could think of for checking this (without grepping)
    @ArchTest
    void entities_must_have_corresponding_repository_service_and_controller_in_the_same_package(JavaClasses classes) {
        Set<JavaClass> entityClasses = classes.stream()
                .filter(clazz -> clazz.isAnnotatedWith(Entity.class))
                .collect(Collectors.toSet());
        Set<String> classIdentifiers = classes.stream().map(JavaClass::getName).collect(Collectors.toSet());

        entityClasses.forEach(entityClass -> {
            List<String> expectedControllerServiceAndRepositoryNames = Stream.of("Controller", "Service", "Repository")
                    .map(layerName -> entityClass.getName() + layerName)
                    .toList();
            assertTrue(
                    classIdentifiers.containsAll(expectedControllerServiceAndRepositoryNames),
                    String.format(
                            "Entity %s does not have a corresponding %s",
                            entityClass.getName(), String.join(" / ", expectedControllerServiceAndRepositoryNames)));
        });
    }

    @ArchTest
    void validators_must_be_suffixed_by_word_validator(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .implement(GenericValidator.class)
                .should()
                .haveSimpleNameEndingWith("Validator")
                .because("of naming conventions");
        rule.check(classes);
    }

    @ArchTest
    void entities_must_belong_to_a_package_of_the_same_name(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Entity.class)
                .should(EntityConditions.mustBelongToPackageHavingMatchingName())
                .because("of naming conventions and vertical slice architecture conventions");
        rule.check(classes);
    }

    @ArchTest
    void controller_must_be_suffixed_by_word_controller(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(RestController.class)
                .should()
                .haveSimpleNameEndingWith("Controller")
                .because("of naming conventions");
        rule.check(classes);
    }

    @ArchTest
    void service_must_be_suffixed_by_word_service(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Service.class)
                .should()
                .haveSimpleNameEndingWith("Service")
                .because("of naming conventions");
        rule.check(classes);
    }

    @ArchTest
    void configuration_must_be_suffixed_by_word_config(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Configuration.class)
                .should()
                .haveSimpleNameEndingWith("Config")
                .because("of naming conventions");
        rule.check(classes);
    }

    @ArchTest
    void repository_must_be_suffixed_by_word_repository(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Repository.class)
                .should()
                .haveSimpleNameEndingWith("Repository")
                .because("of naming conventions");
        rule.check(classes);
    }

    @ArchTest
    void records_are_suffixed_by_word_DTO(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areRecords()
                .should()
                .haveSimpleNameEndingWith("DTO")
                .because("of naming conventions and because records should strictly be used as DTOs");
        rule.check(classes);
    }

    @ArchTest
    void package_names_must_be_lowercase_and_class_names_must_be_pascal_case(JavaClasses classes) {
        ArchRule rule =
                classes().should().haveNameMatching("[a-z.]+[A-Z][a-zA-Z]{2,}").because("of naming conventions");
        rule.check(classes);
    }
}
