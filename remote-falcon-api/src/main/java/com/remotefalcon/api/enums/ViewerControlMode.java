package com.remotefalcon.api.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum ViewerControlMode {
  JUKEBOX("jukebox"),
  VOTING("voting");

  private final String viewerControlMode;
}
