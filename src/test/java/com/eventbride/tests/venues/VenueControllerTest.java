package com.eventbride.tests.venues;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class VenueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetAllVenues_whenNotEmpty() throws Exception {
        mockMvc.perform(get("/api/venues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))))
                .andExpect(jsonPath("$[0].name", is(notNullValue())))
                .andExpect(jsonPath("$[0].available", is(notNullValue())))
                .andExpect(jsonPath("$[0].cityAvailable", is(notNullValue())))
                .andExpect(jsonPath("$[0].fixedPrice", is(notNullValue())))
                .andExpect(jsonPath("$[0].maxGuests", is(notNullValue())));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetAllVenues_structureValidation() throws Exception {
        mockMvc.perform(get("/api/venues"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].postalCode", is(notNullValue())))
                .andExpect(jsonPath("$[0].coordinates", is(notNullValue())))
                .andExpect(jsonPath("$[0].address", is(notNullValue())))
                .andExpect(jsonPath("$[0].surface", is(notNullValue())))
                .andExpect(jsonPath("$[0].earliestTime", is(notNullValue())))
                .andExpect(jsonPath("$[0].latestTime", is(notNullValue())));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testGetAllVenues_asAdmin() throws Exception {
        mockMvc.perform(get("/api/venues"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetVenueById_whenExists() throws Exception {
        mockMvc.perform(get("/api/venues/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").isNotEmpty())
                .andExpect(jsonPath("$.available").isBoolean())
                .andExpect(jsonPath("$.cityAvailable").isNotEmpty());
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetVenueById_whenNotExists() throws Exception {
        mockMvc.perform(get("/api/venues/99999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void testGetVenueById_asAdmin() throws Exception {
        mockMvc.perform(get("/api/venues/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterWithMatchingCityOnly() throws Exception {
        mockMvc.perform(get("/api/venues/filter")
                        .param("city", "Sevilla"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))))
                .andExpect(jsonPath("$[0].cityAvailable", containsString("Sevilla")));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterWithNoMatches() throws Exception {
        mockMvc.perform(get("/api/venues/filter")
                        .param("city", "CiudadImaginaria")
                        .param("maxGuests", "5000")
                        .param("surface", "9999.9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterByCityAndSurface() throws Exception {
        mockMvc.perform(get("/api/venues/filter")
                        .param("city", "Sevilla")
                        .param("surface", "200.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].cityAvailable", containsString("Sevilla")))
                .andExpect(jsonPath("$[0].surface", greaterThanOrEqualTo(200.0)));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterByMaxGuestsOnly() throws Exception {
        mockMvc.perform(get("/api/venues/filter")
                        .param("maxGuests", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterWithoutParameters_returnsAllVenues() throws Exception {
        mockMvc.perform(get("/api/venues/filter"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))));
    }


    @Test
    @WithMockUser(username = "proveedor1", roles = "SUPPLIER")
    void testCreateVenue_withInvalidData_shouldReturnBadRequest() throws Exception {
        String venueJson = """
            {
                "name": "",
                "available": true
            }
            """;

        mockMvc.perform(post("/api/venues")
                        .contentType("application/json")
                        .content(venueJson))
                .andExpect(status().isBadRequest());
    }



}
