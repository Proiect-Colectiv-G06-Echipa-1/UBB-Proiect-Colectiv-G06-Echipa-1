package com.example.User.service;

import com.example.User.User;
import com.example.User.UserDTO;
import com.example.User.UserMapper;
import com.example.User.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper mapper;

    public User getById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));
    }

    public List<UserDTO> getAll() {
        return userRepository.findAll().stream().map(mapper::toDTO).toList();
    }

    public void setEnergy(Long userId, Integer energy) {
        var user = this.getById(userId);
        user.setEnergy(energy);
        userRepository.save(user);
    }
}
