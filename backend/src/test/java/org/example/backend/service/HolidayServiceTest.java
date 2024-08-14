package org.example.backend.service;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.example.backend.model.Holidays;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.io.IOException;
import java.time.Year;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestPropertySource(properties = {
        "FEIERTAGE_URL=https://get.api-feiertage.de"
})
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
    void getHolidaysByYear_success() throws IOException {
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

        List<Holidays> holidays = holidayService.getHolidaysByYear("2024");

        assertNotNull(holidays);
        assertEquals(3, holidays.size());
        assertEquals("Neujahr", holidays.getFirst().getFname());
    }

    @Test
    void getHolidaysByYear_noHolidaysFound() throws IOException {
        // Simuliere eine leere Antwort mit Statuscode 404 Not Found
        String mockResponse = "{ \"status\": \"success\", \"feiertage\": [] }";

        mockWebServer.enqueue(new MockResponse()
                .setBody(mockResponse)
                .setResponseCode(404)  // Simuliere den 404-Statuscode
                .addHeader("Content-Type", "application/json"));

        // Teste, ob eine IOException geworfen wird, wenn keine Feiertage gefunden werden
        assertThrows(IOException.class, () -> {
            holidayService.getHolidaysByYear("2028");
        });
    }

    @Test
    void getHolidaysByYear_throwsIOException() {
        // Simuliere einen Fehlerfall (z.B. 404 Not Found)
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(404));

        // Überprüfung, dass eine IOException geworfen wird
        assertThrows(IOException.class, () -> {
            holidayService.getHolidaysByYear("2029");
        });
    }
}