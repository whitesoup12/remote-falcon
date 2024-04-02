package com.remotefalcon.api.enums;

public enum EmailTemplate {
  SIGN_UP("d-878ef779dd1d492290c41659ccefa75a"),
  FORGOT_PASSWORD("d-f63ce96b60e449619e9a48829a8ad9df"),
  REQUEST_API_ACCESS("d-39650027ae35454bbb4b56c668c123b3");

  public final String templateId;

  private EmailTemplate(String templateId) {
    this.templateId = templateId;
  }
}
