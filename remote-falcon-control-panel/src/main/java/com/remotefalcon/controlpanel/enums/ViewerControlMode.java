package com.remotefalcon.controlpanel.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ViewerControlMode {
  JUKEBOX("jukebox"),
  VOTING("voting");

  private final String viewerControlMode;
}
