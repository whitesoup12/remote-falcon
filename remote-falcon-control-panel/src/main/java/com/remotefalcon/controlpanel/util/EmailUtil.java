package com.remotefalcon.controlpanel.util;

import com.remotefalcon.controlpanel.documents.Show;
import com.remotefalcon.controlpanel.enums.EmailTemplate;
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

  public Response sendSignUpEmail(Show show) {
    Personalization personalization = new Personalization();
    personalization.addTo(new Email(show.getEmail()));
    personalization.addDynamicTemplateData("Show_Name", show.getShowName());
    personalization.addDynamicTemplateData("Verify_Link", String.format("%s/verifyEmail/%s/%s", baseAppUrl, show.getShowToken(), show.getShowSubdomain()));
    return sendEmail(EmailTemplate.SIGN_UP, personalization);
  }

  public Response sendForgotPasswordEmail(Show show, String passwordResetLink) {
    Personalization personalization = new Personalization();
    personalization.addTo(new Email(show.getEmail()));
    personalization.addDynamicTemplateData("Reset_Password_Link", String.format("%s/resetPassword/%s", baseAppUrl, passwordResetLink));
    return sendEmail(EmailTemplate.FORGOT_PASSWORD, personalization);
  }

  public Response sendRequestApiAccessEmail(Show show, String apiAccessToken, String apiAccessSecret) {
    Personalization personalization = new Personalization();
    personalization.addTo(new Email(show.getEmail()));
    personalization.addDynamicTemplateData("Access_Token", apiAccessToken);
    personalization.addDynamicTemplateData("Secret_Key", apiAccessSecret);
    return sendEmail(EmailTemplate.REQUEST_API_ACCESS, personalization);
  }

  private Response sendEmail(EmailTemplate emailTemplate, Personalization personalization) {
    Response response = new Response();
    try {
      Mail mail = new Mail();
      mail.setFrom(new Email(mailFrom));
      mail.setTemplateId(emailTemplate.templateId);
      mail.addPersonalization(personalization);

      SendGrid sg = new SendGrid(sendgridKey);
      Request request = new Request();

      request.setMethod(Method.POST);
      request.setEndpoint("mail/send");
      request.setBody(mail.build());
      response = sg.api(request);

      if (response.getStatusCode() != 202) {
        log.info("Unable to send {} email: {}", emailTemplate, response.getStatusCode());
      }

    } catch (IOException e) {
      log.error("Error sending {} email", emailTemplate, e);
      response.setStatusCode(500);
    }
    return response;
  }
}
