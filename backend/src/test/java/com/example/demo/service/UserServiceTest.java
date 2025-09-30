package com.example.demo.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("plainPassword");
        testUser.setPhno("1234567890");
    }

    @Test
    void testGetAllUsers() {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // Act
        List<User> result = userService.getAllUsers();

        // Assert
        assertEquals(1, result.size());
        assertEquals(testUser.getUsername(), result.get(0).getUsername());
        verify(userRepository).findAll();
    }

    @Test
    void testGetUserById_UserExists() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        User result = userService.getUserById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getUsername(), result.getUsername());
        verify(userRepository).findById(1L);
    }

    @Test
    void testGetUserById_UserNotExists() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        User result = userService.getUserById(1L);

        // Assert
        assertNull(result);
        verify(userRepository).findById(1L);
    }

    @Test
    void testCreateUser_Success() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(null);
        when(passwordEncoder.encode(testUser.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.createUser(testUser);

        // Assert
        assertNotNull(result);
        verify(userRepository).findByEmail(testUser.getEmail());
        verify(passwordEncoder).encode("plainPassword");
        verify(userRepository).save(testUser);
    }

    @Test
    void testCreateUser_EmailAlreadyExists() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(testUser);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.createUser(testUser);
        });
        
        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository).findByEmail(testUser.getEmail());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testAuthenticateUser_Success() {
        // Arrange
        String plainPassword = "plainPassword";
        String encodedPassword = "encodedPassword";
        testUser.setPassword(encodedPassword);
        
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(testUser);
        when(passwordEncoder.matches(plainPassword, encodedPassword)).thenReturn(true);

        // Act
        User result = userService.authenticateUser(testUser.getEmail(), plainPassword);

        // Assert
        assertNotNull(result);
        assertEquals(testUser.getUsername(), result.getUsername());
        verify(userRepository).findByEmail(testUser.getEmail());
        verify(passwordEncoder).matches(plainPassword, encodedPassword);
    }

    @Test
    void testAuthenticateUser_WrongPassword() {
        // Arrange
        String plainPassword = "wrongPassword";
        String encodedPassword = "encodedPassword";
        testUser.setPassword(encodedPassword);
        
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(testUser);
        when(passwordEncoder.matches(plainPassword, encodedPassword)).thenReturn(false);

        // Act
        User result = userService.authenticateUser(testUser.getEmail(), plainPassword);

        // Assert
        assertNull(result);
        verify(userRepository).findByEmail(testUser.getEmail());
        verify(passwordEncoder).matches(plainPassword, encodedPassword);
    }

    @Test
    void testAuthenticateUser_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(null);

        // Act
        User result = userService.authenticateUser(testUser.getEmail(), "anyPassword");

        // Assert
        assertNull(result);
        verify(userRepository).findByEmail(testUser.getEmail());
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void testUpdateUser_Success() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setUsername("updatedUser");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setPassword("newPassword");
        
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = userService.updateUser(1L, updatedUser);

        // Assert
        assertNotNull(result);
        verify(userRepository).findById(1L);
        verify(passwordEncoder).encode("newPassword");
        verify(userRepository).save(testUser);
    }

    @Test
    void testUpdateUser_UserNotFound() {
        // Arrange
        User updatedUser = new User();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        User result = userService.updateUser(1L, updatedUser);

        // Assert
        assertNull(result);
        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testEmailExists_True() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(testUser);

        // Act
        boolean result = userService.emailExists(testUser.getEmail());

        // Assert
        assertTrue(result);
        verify(userRepository).findByEmail(testUser.getEmail());
    }

    @Test
    void testEmailExists_False() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(null);

        // Act
        boolean result = userService.emailExists(testUser.getEmail());

        // Assert
        assertFalse(result);
        verify(userRepository).findByEmail(testUser.getEmail());
    }

    @Test
    void testDeleteUser() {
        // Arrange
        doNothing().when(userRepository).deleteById(1L);

        // Act
        userService.deleteUser(1L);

        // Assert
        verify(userRepository).deleteById(1L);
    }
}