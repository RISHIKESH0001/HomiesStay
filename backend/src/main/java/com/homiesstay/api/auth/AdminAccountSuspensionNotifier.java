package com.homiesstay.api.auth;

import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import com.homiesstay.api.user.AdminAccountSuspendedEvent;

@Component
public class AdminAccountSuspensionNotifier {
	private static final Logger LOGGER = LoggerFactory.getLogger(AdminAccountSuspensionNotifier.class);
	private final JavaMailSender mailSender;
	private final String mailFrom;
	private final String adminContactEmail;

	public AdminAccountSuspensionNotifier(JavaMailSender mailSender,
			@Value("${app.mail.from}") String mailFrom,
			@Value("${app.admin-contact-email}") String adminContactEmail) {
		this.mailSender = mailSender;
		this.mailFrom = mailFrom;
		this.adminContactEmail = adminContactEmail;
	}

	@TransactionalEventListener
	public void sendSuspensionNotice(AdminAccountSuspendedEvent event) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(mailFrom);
		message.setTo(event.recipient());
		message.setReplyTo(adminContactEmail);
		message.setSubject("Your Homies Stay account has been temporarily suspended");
		message.setText("Your account has been suspended until "
				+ DateTimeFormatter.ISO_OFFSET_DATE_TIME.format(event.suspendedUntil().atOffset(ZoneOffset.UTC))
				+ " (UTC).\n\nReason: " + event.reason()
				+ "\n\nIf you believe this is a mistake or need assistance, reply to this email to contact the Homies Stay administrator.");
		try {
			mailSender.send(message);
		} catch (MailException exception) {
			LOGGER.warn("Account suspension notice could not be delivered");
		}
	}
}
