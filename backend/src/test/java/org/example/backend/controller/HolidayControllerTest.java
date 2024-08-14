package org.example.backend.controller;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.io.IOException;

@SpringBootTest
@AutoConfigureMockMvc
class HolidayControllerTest {

    private static MockWebServer mockWebServer;
    @Autowired
    private MockMvc mockMvc;

    @BeforeAll
    static void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();
    }

    @AfterAll
    static void shutDown() throws IOException {
        mockWebServer.shutdown();
    }

    @DynamicPropertySource
    static void backendProps(DynamicPropertyRegistry registry) {
        registry.add("FEIERTAGE_URL", () -> mockWebServer.url("/").toString());
    }

    @Test
    void getHolidaysByYear_shouldReturnListOfHolidays_WhenCalledWithValidYear() throws Exception {

        mockWebServer.enqueue(new MockResponse()
                .addHeader("Content-Type", "application/json")
                .setBody("""
                        {
                                      "status": "success",
                                      "feiertage": [
                                          {
                                              "date": "2024-01-01",
                                              "fname": "Neujahr",
                                              "all_states": "1",
                                                          "bw": "1",
                                                          "by": "1",
                                                          "be": "1",
                                                          "bb": "1",
                                                          "hb": "1",
                                                          "hh": "1",
                                                          "he": "1",
                                                          "mv": "1",
                                                          "ni": "1",
                                                          "nw": "1",
                                                          "rp": "1",
                                                          "sl": "1",
                                                          "sn": "1",
                                                          "st": "1",
                                                          "sh": "1",
                                                          "th": "1",
                                                          "comment": "",
                                                          "augsburg": null,
                                                          "katholisch": null
                                          },
                                          {
                                              "date": "2024-03-29",
                                              "fname": "Karfreitag",
                                               "all_states": "1",
                                                          "bw": "1",
                                                          "by": "1",
                                                          "be": "1",
                                                          "bb": "1",
                                                          "hb": "1",
                                                          "hh": "1",
                                                          "he": "1",
                                                          "mv": "1",
                                                          "ni": "1",
                                                          "nw": "1",
                                                          "rp": "1",
                                                          "sl": "1",
                                                          "sn": "1",
                                                          "st": "1",
                                                          "sh": "1",
                                                          "th": "1",
                                                          "comment": "",
                                                          "augsburg": null,
                                                          "katholisch": null
                                          },
                                          {
                                              "date": "2024-04-01",
                                              "fname": "Ostermontag",
                                          }]}
                        """));
        //WHEN&THEN
        mockMvc.perform(MockMvcRequestBuilders.get("/api/holidays/2024"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                                                                  [
                                                                  {
                                                                      "date": "2024-01-01",
                                                                      "fname": "Neujahr",
                                                                  },
                                                                  {
                                                                      "date": "2024-03-29",
                                                                      "fname": "Karfreitag",
                                                                  },
                                                                  {
                                                                      "date": "2024-04-01",
                                                                      "fname": "Ostermontag",
                                                                  }]
                        """));
    }

}
