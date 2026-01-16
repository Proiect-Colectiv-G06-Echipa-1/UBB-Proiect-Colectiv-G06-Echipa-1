package com.example.rules;

import net.sourceforge.pmd.lang.java.ast.ASTClassDeclaration;
import net.sourceforge.pmd.lang.java.ast.ASTMethodDeclaration;
import net.sourceforge.pmd.lang.java.ast.ASTTryStatement;
import net.sourceforge.pmd.lang.java.rule.AbstractJavaRule;

public class NoTryCatchStatementInControllers extends AbstractJavaRule {
    @Override
    public Object visit(ASTClassDeclaration clazz, Object data) {
        if (clazz.getAnnotation("org.springframework.web.bind.annotation.RestController") != null) {
            for (ASTMethodDeclaration method : clazz.descendants(ASTMethodDeclaration.class)) {
                if (method.descendants(ASTTryStatement.class).nonEmpty()) {
                    asCtx(data).addViolation(method);
                }
            }
        }
        return data;
    }
}