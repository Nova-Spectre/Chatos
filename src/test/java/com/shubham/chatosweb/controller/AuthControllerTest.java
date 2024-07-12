package com.shubham.chatosweb.controller;

import com.shubham.chatosweb.config.TokenProvider;
import com.shubham.chatosweb.exception.UserException;
import com.shubham.chatosweb.model.User;
import com.shubham.chatosweb.repository.UserRepository;
import com.shubham.chatosweb.request.LoginRequest;
import com.shubham.chatosweb.response.AuthResponse;
import com.shubham.chatosweb.service.CustomUserService;
import io.jsonwebtoken.lang.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CustomUserService customUserService;

    @Mock
    private TokenProvider tokenProvider;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateUserHandler_Success() throws UserException {
        // Mock data
        User user = new User(1, "Test User", "test@example.com", null, "password");

        // Mock userRepository behavior
        when(userRepository.findByEmail(any())).thenReturn(null); // No existing user with the same email
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Mock password encoding
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        // Call the controller method
        ResponseEntity<AuthResponse> responseEntity = authController.createUserHandler(user);

        // Verify the response
        assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertTrue(responseEntity.getBody().isAuth());
        assertNotNull(responseEntity.getBody().getJwt());

        // Verify interactions with mocks
        verify(userRepository, times(1)).findByEmail(user.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
        verify(passwordEncoder, times(1)).encode(user.getPassword());
    }

    @Test
    public void testCreateUserHandler_EmailAlreadyExists() {
        // Mock data
        User existingUser = new User(2, "Existing User", "existing@example.com", null, "password");

        // Mock userRepository behavior
        when(userRepository.findByEmail(any())).thenReturn(existingUser); // Existing user with the same email

        // Call the controller method and assert exception
        assertThrows(UserException.class, () -> authController.createUserHandler(existingUser));

        // Verify interactions with mocks
        verify(userRepository, times(1)).findByEmail(existingUser.getEmail());
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    public void testLoginHandler_Success() {
        // Mock data
        LoginRequest request = new LoginRequest("test@example.com", "password");
        User user = new User(1, "Test User", "test@example.com", null, "password");

        // Mock customUserService behavior
        when(customUserService.loadUserByUsername(any())).thenReturn(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        Collections.emptyList() // No authorities needed for this test
                )
        );

        // Mock password encoder
        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        // Mock token provider
        when(tokenProvider.generateToken(any())).thenReturn("generatedToken");

        // Call the controller method
        ResponseEntity<AuthResponse> responseEntity = authController.loginHandler(request);

        // Verify the response
        assertEquals(HttpStatus.ACCEPTED, responseEntity.getStatusCode());
        assertNotNull(responseEntity.getBody());
        assertTrue(responseEntity.getBody().isAuth());
        assertNotNull(responseEntity.getBody().getJwt());

        // Verify interactions with mocks
        verify(customUserService, times(1)).loadUserByUsername(request.getEmail());
        verify(passwordEncoder, times(1)).matches(request.getPassword(), user.getPassword());
        verify(tokenProvider, times(1)).generateToken(any());
    }

    @Test
    public void testLoginHandler_InvalidCredentials() {
        // Mock data
        LoginRequest request = new LoginRequest("test@example.com", "password");

        // Mock customUserService behavior
        when(customUserService.loadUserByUsername(any())).thenReturn(null); // No user found

        // Call the controller method and assert exception
        assertThrows(BadCredentialsException.class, () -> authController.loginHandler(request));

        // Verify interactions with mocks
        verify(customUserService, times(1)).loadUserByUsername(request.getEmail());
        verify(passwordEncoder, never()).matches(any(), any());
        verify(tokenProvider, never()).generateToken(any());
    }

    @Test
    public void testLoginHandler_InvalidPassword() {
        // Mock data
        LoginRequest request = new LoginRequest("test@example.com", "password");
        User user = new User(1, "Test User", "test@example.com", null, "password");

        // Mock customUserService behavior
        when(customUserService.loadUserByUsername(any())).thenReturn(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword(),
                        Collections.emptyList() // No authorities needed for this test
                )
        );

        // Mock password encoder
        when(passwordEncoder.matches(any(), any())).thenReturn(false); // Password does not match

        // Call the controller method and assert exception
        assertThrows(BadCredentialsException.class, () -> authController.loginHandler(request));

        // Verify interactions with mocks
        verify(customUserService, times(1)).loadUserByUsername(request.getEmail());
        verify(passwordEncoder, times(1)).matches(request.getPassword(), user.getPassword());
        verify(tokenProvider, never()).generateToken(any());
    }

    // Add more tests for other scenarios as needed
}
