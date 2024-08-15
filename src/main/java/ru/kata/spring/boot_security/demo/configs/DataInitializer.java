package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.RoleRepository;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

@Configuration
public class DataInitializer {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        Role adminRole = new Role("ROLE_ADMIN");
        Role userRole = new Role("ROLE_USER");
        roleRepository.save(adminRole);
        roleRepository.save(userRole);

        User adminUser = new User();
        adminUser.setFirstName("admin");
        adminUser.setLastName("admin");
        adminUser.setAge(30);
        adminUser.setEmail("admin@example.com");
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode("admin"));
        adminUser.setRoles(new HashSet<>(Arrays.asList(adminRole, userRole)));
        userRepository.save(adminUser);


        User simpleUser = new User();
        simpleUser.setFirstName("User");
        simpleUser.setLastName("User");
        simpleUser.setAge(25);
        simpleUser.setEmail("user@example.com");
        simpleUser.setUsername("User");
        simpleUser.setPassword(passwordEncoder.encode("user"));
        simpleUser.setRoles(Collections.singleton(userRole));
        userRepository.save(simpleUser);
    }
}