package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.model.User;
import org.example.backend.model.UserDTO;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor

public class UserController {
    private final UserService userService;

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public User createUser(@RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
