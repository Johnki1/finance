package com.finanzas.backend.application.util;

import com.finanzas.backend.domain.model.User;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;

public class CurrentUserUtil {

    private CurrentUserUtil() {
    }

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public static void validateOwnership(User entityOwner, User currentUser) {
        if (!entityOwner.getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("No tienes permiso para acceder a este recurso");
        }
    }
}
