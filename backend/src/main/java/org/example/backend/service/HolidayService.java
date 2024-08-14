package org.example.backend.service;

import org.example.backend.model.HolidayResponse;
import org.example.backend.model.Holidays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.List;

@Service
public class HolidayService {
    private final RestClient restClient;

    public HolidayService(@Value("${FEIERTAGE_URL}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public List<Holidays> getHolidaysByYear(String year) throws IOException {
        HolidayResponse response = restClient.get()
                .uri("?years=" + year + "&states=sh")
                .retrieve()
                .body(HolidayResponse.class);
        if (response != null) {
            return response.getFeiertage();
        } else {
            throw new IOException("No Holidays found!");
        }
    }

}
