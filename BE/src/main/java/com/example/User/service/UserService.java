package com.example.User.service;

import com.example.User.*;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final UserValidator validator;

    public User getById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));
    }

    public List<UserDTO> getAll() {
        return userRepository.findAll().stream().map(mapper::toDTO).toList();
    }

    public void setEnergy(Long userId, Integer energy) {
        User user = getById(userId);
        user.setEnergy(energy);
        validator.validate(user);
        userRepository.save(user);
    }
}
