package com.finanzas.backend.application.util;

public interface CrudResponseConverter<T, R> {

    R toResponse(T entity);
}