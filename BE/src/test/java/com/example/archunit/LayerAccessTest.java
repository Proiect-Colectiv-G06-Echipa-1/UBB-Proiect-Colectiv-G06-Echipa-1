package com.example.archunit;

import static com.example.archunit.predicates.ExtraPredicates.classAnnotatedWithAny;
import static com.tngtech.archunit.base.DescribedPredicate.not;
import static com.tngtech.archunit.core.domain.properties.CanBeAnnotated.Predicates.annotatedWith;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.fields;

import com.example.archunit.conditions.ServiceConditions;
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

@AnalyzeClasses(packages = "com.example")
public class LayerAccessTest {
    @ArchTest
    void controllers_use_only_services(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(RestController.class)
                .should()
                .onlyDependOnClassesThat(not(classAnnotatedWithAny(Entity.class, Mapper.class, Repository.class)))
                .because("controllers cannot depend on entities, mappers, or repositories directly");
        rule.check(classes);
    }

    @ArchTest
    void services_do_not_use_controllers(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Service.class)
                .should()
                .onlyDependOnClassesThat(not(annotatedWith(RestController.class)))
                .because("services cannot depend on controllers");
        rule.check(classes);
    }

    @ArchTest
    void services_only_access_their_own_repositories(JavaClasses classes) {
        ArchRule rule = fields().that()
                .areDeclaredInClassesThat()
                .areAnnotatedWith(Service.class)
                .should(ServiceConditions.mustNotHaveNonMatchingRepositories())
                .because("a service cannot use other repositories directly other than its own");
        rule.check(classes);
    }

    @ArchTest
    void repositories_are_isolated(JavaClasses classes) {
        ArchRule rule = classes()
                .that()
                .areAnnotatedWith(Repository.class)
                .should()
                .onlyDependOnClassesThat(
                        not(classAnnotatedWithAny(Mapper.class, Repository.class, RestController.class, Service.class)))
                .because("repositores should be isolated");
        rule.check(classes);
    }
}
