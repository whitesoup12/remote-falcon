package com.remotefalcon.api.util;

import com.remotefalcon.api.entity.ExternalApiAccess;
import com.remotefalcon.api.entity.PasswordReset;
import com.remotefalcon.api.entity.Remote;
import com.remotefalcon.api.enums.EmailTemplate;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class EmailUtil {

  @Value("${MAIL_FROM}")
  String mailFrom;

  @Value("${SENDGRID_KEY}")
  String sendgridKey;

  @Value("${BASE_APP_URL}")
  String baseAppUrl;

  public Response sendEmail(Remote remote, PasswordReset passwordResets, ExternalApiAccess externalApiAccess, EmailTemplate emailTemplate) {
    Response response = new Response();
    try {
      Mail mail = new Mail();
      mail.setFrom(new Email(mailFrom));
      mail.setTemplateId(emailTemplate.templateId);
      mail.addPersonalization(this.setDynamicEmailTemplateData(remote, passwordResets, externalApiAccess, emailTemplate));

      SendGrid sg = new SendGrid(sendgridKey);
      Request request = new Request();

      request.setMethod(Method.POST);
      request.setEndpoint("mail/send");
      request.setBody(mail.build());
      response = sg.api(request);

      if (response.getStatusCode() != 202) {
        log.info("Unable to send {} email: {}", emailTemplate.toString(), response.getStatusCode());
      }

    } catch (IOException e) {
      log.error("Error sending {} email", emailTemplate.toString(), e);
      response.setStatusCode(500);
    }
    return response;
  }

  private Personalization setDynamicEmailTemplateData(Remote remote, PasswordReset passwordResets, ExternalApiAccess externalApiAccess, EmailTemplate emailTemplate) {
    Personalization personalization = new Personalization();
    personalization.addTo(new Email(remote.getEmail()));
    if (emailTemplate == EmailTemplate.VERIFICATION) {
      personalization.addDynamicTemplateData("Show_Name", remote.getRemoteName());
      personalization.addDynamicTemplateData("Verify_Link", String.format("%s/verifyEmail/%s/%s", baseAppUrl, remote.getRemoteToken(), remote.getRemoteSubdomain()));
    } else if (emailTemplate == EmailTemplate.FORGOT_PASSWORD) {
      personalization.addDynamicTemplateData("Reset_Password_Link", String.format("%s/resetPassword/%s", baseAppUrl, passwordResets.getPasswordResetLink()));
    } else if (emailTemplate == EmailTemplate.REQUEST_API_ACCESS) {
      personalization.addDynamicTemplateData("Access_Token", externalApiAccess.getAccessToken());
      personalization.addDynamicTemplateData("Secret_Key", externalApiAccess.getAccessSecret());
    }
    return personalization;
  }
}
