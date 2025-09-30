package com.example.demo.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Arrays;
import java.util.List;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setPhno("1234567890");
    }

    @Test
    void testGetAllUsers_Success() throws Exception {
        // Arrange
        List<User> users = Arrays.asList(testUser);
        when(userService.getAllUsers()).thenReturn(users);

        // Act & Assert
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("testuser"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));

        verify(userService).getAllUsers();
    }

    @Test
    void testGetUserById_Success() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUserById(1L);
    }

    @Test
    void testGetUserById_NotFound() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isNotFound());

        verify(userService).getUserById(1L);
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        // Arrange
        when(userService.createUser(any(User.class))).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"));

        verify(userService).createUser(any(User.class));
    }

    @Test
    void testRegisterUser_ValidationError() throws Exception {
        // Arrange
        User invalidUser = new User();
        invalidUser.setUsername(""); // Invalid: empty username
        invalidUser.setEmail("invalid-email"); // Invalid: not a proper email
        invalidUser.setPassword("123"); // Invalid: too short

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.errors").exists());

        verify(userService, never()).createUser(any(User.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() throws Exception {
        // Arrange
        when(userService.createUser(any(User.class)))
                .thenThrow(new RuntimeException("Email already exists"));

        // Act & Assert
        mockMvc.perform(post("/api/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already exists"));

        verify(userService).createUser(any(User.class));
    }

    @Test
    void testLoginUser_Success() throws Exception {
        // Arrange
        when(userService.authenticateUser("test@example.com", "password123"))
                .thenReturn(testUser);

        String loginJson = "{\"email\":\"test@example.com\",\"password\":\"password123\"}";

        // Act & Assert
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.user.username").value("testuser"))
                .andExpect(jsonPath("$.token").exists());

        verify(userService).authenticateUser("test@example.com", "password123");
    }

    @Test
    void testLoginUser_InvalidCredentials() throws Exception {
        // Arrange
        when(userService.authenticateUser("test@example.com", "wrongpassword"))
                .thenReturn(null);

        String loginJson = "{\"email\":\"test@example.com\",\"password\":\"wrongpassword\"}";

        // Act & Assert
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));

        verify(userService).authenticateUser("test@example.com", "wrongpassword");
    }

    @Test
    void testLoginUser_MissingCredentials() throws Exception {
        // Arrange
        String loginJson = "{\"email\":\"\",\"password\":\"\"}";

        // Act & Assert
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email and password are required"));

        verify(userService, never()).authenticateUser(anyString(), anyString());
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        // Arrange
        User updatedUser = new User();
        updatedUser.setUsername("updateduser");
        updatedUser.setEmail("updated@example.com");
        
        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User updated successfully"));

        verify(userService).updateUser(eq(1L), any(User.class));
    }

    @Test
    void testUpdateUser_NotFound() throws Exception {
        // Arrange
        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(null);

        // Act & Assert
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isNotFound());

        verify(userService).updateUser(eq(1L), any(User.class));
    }

    @Test
    void testDeleteUser_Success() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(testUser);
        doNothing().when(userService).deleteUser(1L);

        // Act & Assert
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User deleted successfully"));

        verify(userService).getUserById(1L);
        verify(userService).deleteUser(1L);
    }

    @Test
    void testDeleteUser_NotFound() throws Exception {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(null);

        // Act & Assert
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNotFound());

        verify(userService).getUserById(1L);
        verify(userService, never()).deleteUser(1L);
    }

    @Test
    void testCheckEmailExists_True() throws Exception {
        // Arrange
        when(userService.emailExists("test@example.com")).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/users/check-email")
                .param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(true));

        verify(userService).emailExists("test@example.com");
    }

    @Test
    void testCheckEmailExists_False() throws Exception {
        // Arrange
        when(userService.emailExists("nonexistent@example.com")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get("/api/users/check-email")
                .param("email", "nonexistent@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.exists").value(false));

        verify(userService).emailExists("nonexistent@example.com");
    }
}