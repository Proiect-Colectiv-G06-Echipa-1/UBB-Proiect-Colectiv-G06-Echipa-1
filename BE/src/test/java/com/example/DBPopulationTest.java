package com.example;

import com.example.User.User;
import com.example.User.UserRepository;
import com.example.User.UserRole;
import com.example.task.Task;
import com.example.task.TaskRepository;
import com.example.task.TaskStatus;
import com.example.utils.AnnotationReader;
import java.lang.reflect.Field;
import java.time.ZoneId;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootTest
public class DBPopulationTest {
    @Autowired
    private TaskRepository taskRepository;

    @Value("${faker.tasks.reset}")
    private boolean shouldResetTasksTable;

    @Value("${faker.tasks.count}")
    private int taskCount;

    @Autowired
    private UserRepository userRepository;

    @Value("${faker.users.reset}")
    private boolean shouldResetUsersTable;

    @Value("${faker.users.count}")
    private int userCount;

    @Autowired
    private PasswordEncoder encoder;

    private final Faker faker = new Faker();

    @Test
    void populateTasksTable() throws NoSuchFieldException {
        if (shouldResetTasksTable) {
            taskRepository.deleteAll();
        }

        Field damage, procrastinationDamage, energyCost;
        try {
            damage = Task.class.getDeclaredField("damage");
            procrastinationDamage = Task.class.getDeclaredField("procrastinationDamage");
            energyCost = Task.class.getDeclaredField("energyCost");
        } catch (NoSuchFieldException err) {
            System.err.println(
                    "One or more fields used for reflection in this test are out of date. One should update this test accordingly");
            throw err;
        }

        IntStream.range(0, taskCount).forEach(_ -> {
            Task task = new Task();
            task.setStatus(faker.options().option(TaskStatus.class))
                    .setDamage(faker.number()
                            .numberBetween(
                                    AnnotationReader.tryGetMinValue(damage, 0),
                                    AnnotationReader.tryGetMaxValue(damage, 100)))
                    .setProcrastinationDamage(faker.number()
                            .numberBetween(
                                    AnnotationReader.tryGetMinValue(procrastinationDamage, 0),
                                    AnnotationReader.tryGetMaxValue(procrastinationDamage, 100)))
                    .setCreationDate(faker.timeAndDate()
                            .past()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate())
                    .setDeadline(faker.timeAndDate()
                            .future()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDate())
                    .setEnergyCost(faker.number()
                            .numberBetween(
                                    AnnotationReader.tryGetMinValue(energyCost, 0),
                                    AnnotationReader.tryGetMaxValue(energyCost, 10)))
                    .setTitle(String.join(
                            " ", List.of(faker.hacker().verb(), faker.hacker().noun())))
                    .setDescription(
                            String.join(" ", faker.lorem().words(faker.number().numberBetween(5, 25))))
                    .setAssignees(Set.of())
                    .setParents(Set.of());
            taskRepository.save(task);
        });
    }

    @Test
    void populateUsersTable() throws NoSuchFieldException {
        if (shouldResetUsersTable) {
            userRepository.deleteAll();
        }

        Field password, energy;
        try {
            password = User.class.getDeclaredField("password");
            energy = User.class.getDeclaredField("energy");
        } catch (NoSuchFieldException err) {
            System.err.println(
                    "One or more fields used for reflection in this test are out of date. One should update this test accordingly");
            throw err;
        }

        IntStream.range(0, userCount).forEach(_ -> {
            User user = new User();
            user.setRole(faker.options().option(UserRole.class))
                    .setEnergy(faker.number()
                            .numberBetween(
                                    AnnotationReader.tryGetMinValue(energy, 0),
                                    AnnotationReader.tryGetMaxValue(energy, 10)))
                    .setPassword(encoder.encode("a".repeat(AnnotationReader.tryGetMinLength(password, 8))))
                    .setAssignedTasks(Set.of());
            user.setUsername(faker.hololive().talent());
            user.setUsername(IntStream.iterate(0, i -> i + 1)
                    .mapToObj(i -> user.getUsername() + (i == 0 ? "" : i))
                    .filter(username -> !userRepository.existsByUsername(username))
                    .findFirst()
                    .orElseThrow());
            user.setEmail(faker.internet().safeEmailAddress(user.getUsername()));
            userRepository.save(user);
        });
    }
}
