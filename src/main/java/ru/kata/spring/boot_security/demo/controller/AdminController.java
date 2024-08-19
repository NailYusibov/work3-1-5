package ru.kata.spring.boot_security.demo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role; // Импорт модели Role
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    // Получение всех пользователей
    @GetMapping("/table")
    public ResponseEntity<List<User>> viewUsers() {
        logger.info("Получение всех пользователей");
        List<User> users = userService.listUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Редактирование пользователя
    @PatchMapping("/{id}/edit")
    public ResponseEntity<HttpStatus> editUser(@PathVariable Long id, @RequestBody User user) {
        logger.info("Редактирование пользователя с id: {}", id);
        user.setId(id);
        userService.update(user);
        logger.info("Пользователь с id: {} отредактирован", id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Удаление пользователя
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") long id) {
        logger.info("Удаление пользователя с id: {}", id);
        userService.delete(id);
        logger.info("Пользователь с id: {} удален", id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // Создание нового пользователя
    @PostMapping("/create")
    public ResponseEntity<HttpStatus> createUser(@RequestBody User user) {
        logger.info("Создание пользователя с именем: {}", user.getUsername());
        userService.add(user);
        logger.info("Пользователь с именем: {} создан", user.getUsername());
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // Получение пользователя по id
    @GetMapping("/{id}")
    public ResponseEntity<User> showUser(@PathVariable("id") Long id) {
        logger.info("Получение пользователя с id: {}", id);
        User user = userService.findById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // Получение аутентифицированного пользователя
    @GetMapping("/auth")
    public ResponseEntity<User> getApiAuthUser(@AuthenticationPrincipal User user) {
        logger.info("Получение аутентифицированного пользователя");
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // Получение всех ролей
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        logger.info("Получение всех ролей");
        List<Role> roles = userService.getAllRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
}
