package com.finanzas.backend.application.service.impl;

import com.finanzas.backend.application.dto.AuthRequest;
import com.finanzas.backend.application.dto.AuthResponse;
import com.finanzas.backend.application.dto.RegisterRequest;
import com.finanzas.backend.application.dto.MeResponse;
import com.finanzas.backend.application.service.AuthService;
import com.finanzas.backend.application.service.EmailService;
import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.domain.model.VerificationToken;
import com.finanzas.backend.infrastructure.repository.UserRepository;
import com.finanzas.backend.infrastructure.repository.VerificationTokenRepository;
import com.finanzas.backend.infrastructure.security.JwtService;
import com.finanzas.backend.presentation.exception.BusinessValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessValidationException("El email ya está registrado");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .role("USER")
                .build();

        userRepository.save(user);

        String verificationToken = java.util.UUID.randomUUID().toString();
        VerificationToken tokenEntity = VerificationToken.builder()
                .token(verificationToken)
                .user(user)
                .expiryDate(java.time.LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(tokenEntity);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        return new AuthResponse(
                null,
                "Bearer",
                null,
                null,
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        new String[]{user.getRole()},
                        user.isEmailVerified()
                )
        );
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales incorrectas"));

        Instant now = Instant.now();
        long expirationSeconds = 3600;

        String token = jwtService.generateToken(request.email(), expirationSeconds);

        return new AuthResponse(
                token,
                "Bearer",
                now.plusSeconds(expirationSeconds),
                null,
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        new String[]{user.getRole()},
                        user.isEmailVerified()
                )
        );
    }

    @Override
    @Transactional
    public void verifyAccount(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessValidationException("Token de verificación inválido"));

        if (verificationToken.isExpired()) {
            verificationTokenRepository.deleteByToken(token);
            throw new BusinessValidationException("El token de verificación ha expirado");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        verificationTokenRepository.deleteByToken(token);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessValidationException("No existe una cuenta con ese correo electrónico"));

        String resetToken = java.util.UUID.randomUUID().toString();
        VerificationToken tokenEntity = VerificationToken.builder()
                .token(resetToken)
                .user(user)
                .expiryDate(java.time.LocalDateTime.now().plusHours(24))
                .build();
        verificationTokenRepository.save(tokenEntity);

        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessValidationException("Token de recuperación inválido"));

        if (verificationToken.isExpired()) {
            verificationTokenRepository.deleteByToken(token);
            throw new BusinessValidationException("El token de recuperación ha expirado");
        }

        User user = verificationToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        verificationTokenRepository.deleteByToken(token);
    }

    @Override
    public MeResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no autenticado"));

        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                new String[]{user.getRole()},
                user.isEmailVerified(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );
    }
}