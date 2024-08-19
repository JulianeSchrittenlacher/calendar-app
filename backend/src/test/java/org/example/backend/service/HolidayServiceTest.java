package org.example.backend.service;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.example.backend.exceptions.BadRequestException;
import org.example.backend.model.Holidays;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class HolidayServiceTest {

    private static MockWebServer mockWebServer;
    private HolidayService holidayService;

    @BeforeEach
    void setUp() throws Exception {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
        String baseUrl = mockWebServer.url("/").toString();
        holidayService = new HolidayService(baseUrl);
    }

    @AfterEach
    void tearDown() throws Exception {
        mockWebServer.shutdown();
    }

    @Test
    void getHolidaysByYearAndState_success() {
        String mockResponse = "{"
                + "\"status\": \"success\","
                + "\"feiertage\": ["
                + "{ \"date\": \"2024-01-01\", \"fname\": \"Neujahr\" },"
                + "{ \"date\": \"2024-03-29\", \"fname\": \"Karfreitag\" },"
                + "{ \"date\": \"2024-04-01\", \"fname\": \"Ostermontag\" }"
                + "]"
                + "}";

        mockWebServer.enqueue(new MockResponse()
                .setBody(mockResponse)
                .addHeader("Content-Type", "application/json"));

        List<Holidays> holidays = holidayService.getHolidaysByYearAndState("2024", "sh");

        assertNotNull(holidays);
        assertEquals(3, holidays.size());
        assertEquals("Neujahr", holidays.getFirst().getFname());
    }

    @Test
    void getHolidaysByYear_noHolidaysFound() {
        String mockResponse = "{ \"status\": \"success\", \"feiertage\": [] }";

        mockWebServer.enqueue(new MockResponse()
                .setBody(mockResponse)
                .setResponseCode(404)
                .addHeader("Content-Type", "application/json"));

        assertThrows(BadRequestException.class, () -> holidayService.getHolidaysByYearAndState("2029", "sh"));
    }

    @Test
    void getHolidaysByYear_throwsIOException() {

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(404));
        assertThrows(BadRequestException.class, () -> holidayService.getHolidaysByYearAndState("2029", "sh"));
    }
}