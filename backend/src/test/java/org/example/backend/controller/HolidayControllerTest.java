package org.example.backend.controller;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.io.IOException;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    @WithMockUser
    void getHolidaysByYearAndState_shouldReturnListOfHolidays_WhenCalledWithValidYearAndState() throws Exception {

        mockWebServer.enqueue(new MockResponse()
                .addHeader("Content-Type", "application/json")
                .setBody("""
                        {
                                                                       "status": "success",
                                                                       "feiertage": [
                                                                           {
                                                                               "date": "2024-01-01",
                                                                               "fname": "Neujahr"
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
                                                                               "fname": "Ostermontag"
                                                                           }
                                                                       ]
                                                                   }
                        """));
        //WHEN&THEN
        mockMvc.perform(get("/api/holidays/2024/sh"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().json("""
                                                                  [
                                                                           {
                                                                               "date": "2024-01-01",
                                                                               "fname": "Neujahr"
                                                                           },
                                                                           {
                                                                               "date": "2024-03-29",
                                                                               "fname": "Karfreitag"
                                                                           },
                                                                           {
                                                                               "date": "2024-04-01",
                                                                               "fname": "Ostermontag"
                                                                           }
                                                                       ]
                        """));
    }

    @Test
    @WithMockUser
    void getHolidaysByYearAndState_shouldReturn400_whenCalledWithInvalidArguments() throws Exception {
        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(400)
                .addHeader("Content-Type", "application/json"));

        mockMvc.perform(get("/api/holidays/2024/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getHolidaysByYearAndState_shouldReturnUnautherized_whenCalledWithoutMockUser() throws Exception {

        mockWebServer.enqueue(new MockResponse()
                .setResponseCode(401)
                .addHeader("Content-Type", "application/json"));

        mockMvc.perform(MockMvcRequestBuilders.get("/api/holidays/2024/sh")
                        .with(csrf()))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());
    }

}
