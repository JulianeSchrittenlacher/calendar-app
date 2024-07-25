package org.example.backend.exceptions;

import org.example.backend.model.AppointmentDTO;
import org.example.backend.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class GlobalExceptionHandlerTest {
    @Autowired
    MockMvc mockMvc;

    @MockBean
    private AppointmentService appointmentService;

    @Test
    public void testHandleIdNotFoundException() throws Exception {
        Mockito.when(appointmentService.updateAppointment(Mockito.any(String.class), Mockito.any(AppointmentDTO.class)))
                .thenThrow(new AppointmentNotFoundException("This is a AppointmentNotFoundException"));

        mockMvc.perform(MockMvcRequestBuilders.put("/api/calender/123")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "description": "Meeting with team",
                          "startTime": "2024-07-16T09:00:00Z",
                          "endTime": "2024-07-16T10:00:00Z"
                        }
                    
                        """))
                .andExpect(status().isNotFound())
                .andExpect(content().string("This is a AppointmentNotFoundException"));
    }
}
