package com.example.User;

import com.example.User.dto.AuthResponse;
import com.example.User.dto.ErrorResponse;
import com.example.User.dto.LoginRequest;
import com.example.User.dto.RegisterRequest;
import com.example.User.dto.RegisterResponse;
import com.example.User.service.JwtService;
import com.example.User.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    @Operation(summary = "Authenticate user and return JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))
            }),
            @ApiResponse(responseCode = "401", description = "Invalid username or password", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))
            })
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateJwtToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setTokenType("Bearer");
            response.setUsername(userDetails.getUsername());

            return ResponseEntity.ok(response);
        } catch (AuthenticationException _) {
            ErrorResponse errorResponse = new ErrorResponse("Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @Operation(summary = "Register a new user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterResponse.class))
            }),
            @ApiResponse(responseCode = "400", description = "Username or email already exists", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))
            }),
            @ApiResponse(responseCode = "500", description = "Internal server error during registration", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))
            })
    })
    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(registerRequest.getUsername())) {
                ErrorResponse errorResponse = new ErrorResponse("Username is already taken");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                ErrorResponse errorResponse = new ErrorResponse("Email is already in use");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Create new user
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            // FIXME currently there is no way for admin users to be created
            user.setRole(UserRole.ROLE_USER);
            user.setEnergy(5);
            // Save user to database
            userRepository.save(user);

            // Return success response
            RegisterResponse response = new RegisterResponse("User registered successfully", user.getUsername(),
                    user.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            ErrorResponse errorResponse = new ErrorResponse("Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @Operation(summary = "Get all users")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Users retrieved successfully", content = {
                    @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = UserDTO.class)))
            })
    })
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @Operation(summary = "Get the energy level of a user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Energy retrieved successfully.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = Integer.class))
            })
    })
    @GetMapping("/{id}/energy")
    public ResponseEntity<Integer> getEnergy(@PathVariable long id) {
        return ResponseEntity.ok(userService.getById(id).getEnergy());
    }

    @Operation(summary = "Set the energy level of a user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Energy set successfully.")
    })
    @PatchMapping("/{id}/energy")
    public ResponseEntity<Integer> setEnergy(@PathVariable long id, @RequestBody EnergyUpdateRequest updateRequest) {
        userService.setEnergy(id, updateRequest.getEnergy());
        return ResponseEntity.ok().build();
    }

}
