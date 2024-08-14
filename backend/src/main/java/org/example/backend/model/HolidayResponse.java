package org.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HolidayResponse {
    private List<Holidays> feiertage;
}
