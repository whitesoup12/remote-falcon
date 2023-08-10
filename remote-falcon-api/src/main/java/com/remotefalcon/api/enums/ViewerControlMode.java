package com.remotefalcon.api.enums;

public enum ViewerControlMode {
  JUKEBOX("jukebox"),
  VOTING("voting");

  public final String viewerControlMode;

  private ViewerControlMode(String viewerControlMode) {
    this.viewerControlMode = viewerControlMode;
  }
}
