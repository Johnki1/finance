package com.finanzas.backend.presentation.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, Long id) {
        super(resourceName + " no encontrado con id: " + id);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}