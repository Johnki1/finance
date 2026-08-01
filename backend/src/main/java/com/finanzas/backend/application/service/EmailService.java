package com.finanzas.backend.application.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String token) {
        try {
            String subject = "Verifica tu cuenta";
            String verificationLink = "http://localhost:5173/verify?token=" + token;
            String body = "<html><body>"
                    + "<p>Gracias por registrarte. Haz clic en el siguiente enlace para verificar tu cuenta:</p>"
                    + "<a href=\"" + verificationLink + "\">Verificar cuenta</a>"
                    + "</body></html>";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Correo de verificación enviado a: {}", to);
        } catch (MessagingException e) {
            log.error("Error al enviar correo de verificación a {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        try {
            String subject = "Restablece tu contraseña";
            String resetLink = "http://localhost:5173/reset-password?token=" + token;
            String body = "<html><body>"
                    + "<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>"
                    + "<a href=\"" + resetLink + "\">Restablecer contraseña</a>"
                    + "</body></html>";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
            log.info("Correo de recuperación enviado a: {}", to);
        } catch (MessagingException e) {
            log.error("Error al enviar correo de recuperación a {}: {}", to, e.getMessage());
        }
    }
}
