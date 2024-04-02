package com.remotefalcon.api.util;

import com.remotefalcon.api.response.dashboard.DashboardStatsResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.output.ByteArrayOutputStream;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@Slf4j
public class ExcelUtil {

  public ResponseEntity<ByteArrayResource> generateDashboardExcel(DashboardStatsResponse dashboardStats, String timezone) {
    ResponseEntity<ByteArrayResource> response =  ResponseEntity.status(204).build();
    Workbook workbook = new XSSFWorkbook();

    this.uniquePageVisitsByDate(workbook, dashboardStats, timezone);
    this.totalPageVisitsByDate(workbook, dashboardStats, timezone);
    this.sequenceRequestsByDate(workbook, dashboardStats, timezone);
    this.sequenceRequestsBySequence(workbook, dashboardStats);
    this.sequenceVotesByDate(workbook, dashboardStats, timezone);
    this.sequenceVotesBySequence(workbook, dashboardStats);
    this.sequenceWinsByDate(workbook, dashboardStats, timezone);
    this.sequenceWinsBySequence(workbook, dashboardStats);

    try {
      ByteArrayOutputStream out = new ByteArrayOutputStream();
      workbook.write(out);
      ByteArrayResource resource = new ByteArrayResource(out.toByteArray());
      HttpHeaders httpHeaders = new HttpHeaders();
      httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=stats.xlsx");
      httpHeaders.add(HttpHeaders.CONTENT_LENGTH, String.valueOf(out.toByteArray().length));
      response = ResponseEntity.ok().headers(httpHeaders).contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(resource);
      out.close();
      workbook.close();
    } catch (IOException e) {
      log.error("Error creating XLSX file", e);
    }
    return response;
  }

  private void uniquePageVisitsByDate(Workbook workbook, DashboardStatsResponse dashboardStats, String timezone) {
    Sheet sheet = workbook.createSheet("Unique Page Visits by Date");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Date");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Unique Visits");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getPage().forEach(visit -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(formatDateColumn(visit.getDate(), timezone));

      cell = row.createCell(1);
      cell.setCellValue(visit.getUnique());

      rowIndex.getAndIncrement();
    });
  }

  private void totalPageVisitsByDate(Workbook workbook, DashboardStatsResponse dashboardStats, String timezone) {
    Sheet sheet = workbook.createSheet("Total Page Visits by Date");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Date");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Total Visits");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getPage().forEach(visit -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(formatDateColumn(visit.getDate(), timezone));

      cell = row.createCell(1);
      cell.setCellValue(visit.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private void sequenceRequestsByDate(Workbook workbook, DashboardStatsResponse dashboardStats, String timezone) {
    Sheet sheet = workbook.createSheet("Sequence Requests by Date");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 12000);
    sheet.setColumnWidth(2, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Date");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Sequence Requests");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(2);
    headerCell.setCellValue("Total Requests");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getJukeboxByDate().forEach(request -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(formatDateColumn(request.getDate(), timezone));

      cell = row.createCell(1);
      StringBuilder sequenceRequests = new StringBuilder();
      int sequenceRequestIndex = 1;
      for(DashboardStatsResponse.Sequence sequenceRequest : request.getSequences()) {
        sequenceRequests.append(String.format("%s: %s", sequenceRequest.getName(), sequenceRequest.getTotal()));
        if(request.getSequences().size() > sequenceRequestIndex) {
          sequenceRequests.append("\r\n");
        }
        sequenceRequestIndex++;
      }
      cell.setCellValue(sequenceRequests.toString());
      cell.setCellStyle(getCellWrapStyle(workbook));

      cell = row.createCell(2);
      cell.setCellValue(request.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private void sequenceRequestsBySequence(Workbook workbook, DashboardStatsResponse dashboardStats) {
    Sheet sheet = workbook.createSheet("Sequence Requests by Sequence");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Sequence Name");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Total Requests");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getJukeboxBySequence().getSequences().forEach(sequence -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(sequence.getName());

      cell = row.createCell(1);
      cell.setCellValue(sequence.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private void sequenceVotesByDate(Workbook workbook, DashboardStatsResponse dashboardStats, String timezone) {
    Sheet sheet = workbook.createSheet("Sequence Votes by Date");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 12000);
    sheet.setColumnWidth(2, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Date");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Sequence Votes");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(2);
    headerCell.setCellValue("Total Votes");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getVotingByDate().forEach(vote -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(formatDateColumn(vote.getDate(), timezone));

      cell = row.createCell(1);
      StringBuilder sequenceRequests = new StringBuilder();
      int sequenceVoteIndex = 1;
      for(DashboardStatsResponse.Sequence sequenceVote : vote.getSequences()) {
        sequenceRequests.append(String.format("%s: %s", sequenceVote.getName(), sequenceVote.getTotal()));
        if(vote.getSequences().size() > sequenceVoteIndex) {
          sequenceRequests.append("\r\n");
        }
        sequenceVoteIndex++;
      }
      cell.setCellValue(sequenceRequests.toString());
      cell.setCellStyle(getCellWrapStyle(workbook));

      cell = row.createCell(2);
      cell.setCellValue(vote.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private void sequenceVotesBySequence(Workbook workbook, DashboardStatsResponse dashboardStats) {
    Sheet sheet = workbook.createSheet("Sequence Votes by Sequence");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Sequence Name");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Total Votes");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getVotingBySequence().getSequences().forEach(sequence -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(sequence.getName());

      cell = row.createCell(1);
      cell.setCellValue(sequence.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private void sequenceWinsByDate(Workbook workbook, DashboardStatsResponse dashboardStats, String timezone) {
    Sheet sheet = workbook.createSheet("Sequence Wins by Date");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 12000);
    sheet.setColumnWidth(2, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Date");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Sequence Wins");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(2);
    headerCell.setCellValue("Total Wins");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getVotingWinByDate().forEach(win -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(formatDateColumn(win.getDate(), timezone));

      cell = row.createCell(1);
      StringBuilder sequenceRequests = new StringBuilder();
      int sequenceVoteIndex = 1;
      for(DashboardStatsResponse.Sequence sequenceWin : win.getSequences()) {
        sequenceRequests.append(String.format("%s: %s", sequenceWin.getName(), sequenceWin.getTotal()));
        if(win.getSequences().size() > sequenceVoteIndex) {
          sequenceRequests.append("\r\n");
        }
        sequenceVoteIndex++;
      }
      cell.setCellValue(sequenceRequests.toString());
      cell.setCellStyle(getCellWrapStyle(workbook));

      cell = row.createCell(2);
      cell.setCellValue(win.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private void sequenceWinsBySequence(Workbook workbook, DashboardStatsResponse dashboardStats) {
    Sheet sheet = workbook.createSheet("Sequence Wins by Sequence");
    sheet.setColumnWidth(0, 6000);
    sheet.setColumnWidth(1, 4000);

    Row header = sheet.createRow(0);

    Cell headerCell = header.createCell(0);
    headerCell.setCellValue("Sequence Name");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    headerCell = header.createCell(1);
    headerCell.setCellValue("Total Wins");
    headerCell.setCellStyle(getHeaderStyle(workbook));

    AtomicInteger rowIndex = new AtomicInteger(1);
    dashboardStats.getVotingWinBySequence().getSequences().forEach(sequence -> {
      Row row = sheet.createRow(rowIndex.get());

      Cell cell = row.createCell(0);
      cell.setCellValue(sequence.getName());

      cell = row.createCell(1);
      cell.setCellValue(sequence.getTotal());

      rowIndex.getAndIncrement();
    });
  }

  private CellStyle getHeaderStyle(Workbook workbook) {
    CellStyle cellStyle = workbook.createCellStyle();
    XSSFFont font = ((XSSFWorkbook) workbook).createFont();
    font.setBold(true);
    cellStyle.setFont(font);
    return cellStyle;
  }

  private CellStyle getCellWrapStyle(Workbook workbook) {
    CellStyle cellStyle = workbook.createCellStyle();
    cellStyle.setWrapText(true);
    return cellStyle;
  }

  private String formatDateColumn(Long date, String timezone) {
    return ZonedDateTime.ofInstant(Instant.ofEpochMilli(date), ZoneId.of(timezone == null ? "America/Chicago" : timezone)).format(DateTimeFormatter.ISO_LOCAL_DATE);
  }
}
