package com.finanzas.backend.infrastructure.security;

import com.finanzas.backend.domain.model.User;
import com.finanzas.backend.infrastructure.repository.UserRepository;
import com.finanzas.backend.presentation.exception.AccountNotVerifiedException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
        
        if (!user.isEmailVerified()) {
            throw new AccountNotVerifiedException("Debes verificar tu cuenta antes de iniciar sesión.");
        }
        
        return user;
    }
}
