package com.remotefalcon.controlpanel.controller;

import com.remotefalcon.controlpanel.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PostMapping(value = "/admin/migrateAllToMongo")
    public ResponseEntity<?> migrateAllToMongo() {
        return adminService.migrateAllToMongo();
    }

    @PostMapping(value = "/admin/migrateShowToMongo/token/{token}")
    public ResponseEntity<?> migrateShowToMongo(@PathVariable(name = "token") String token) {
        return adminService.migrateShowToMongo(token);
    }
}
