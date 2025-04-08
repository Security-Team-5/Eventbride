package com.eventbride.tests.otherServices;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Collections;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.eventbride.event_properties.EventPropertiesService;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.otherService.OtherServiceService;
import com.eventbride.user.User;
import com.eventbride.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;


@SpringBootTest
@AutoConfigureMockMvc
class OtherServiceIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private OtherServiceService otherServiceService;

    @MockBean
    private EventPropertiesService eventPropertiesService;

    @Autowired
    private OtherServiceRepository otherServiceRepository;


    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetAllAvailableOtherServicesAsClient() throws Exception {
        mockMvc.perform(get("/api/other-services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))))
                .andExpect(jsonPath("$[0].available", is(true)))
                .andExpect(jsonPath("$[0].name", is(notNullValue())))
                .andExpect(jsonPath("$[0].otherServiceType", is(notNullValue())));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetOtherServiceById_whenExists() throws Exception {
        mockMvc.perform(get("/api/other-services/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.name").isNotEmpty())
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testGetOtherServiceById_whenNotExists() throws Exception {
        mockMvc.perform(get("/api/other-services/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").isNotEmpty())
                .andExpect(jsonPath("$.available").value(false));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterWithNoMatch() throws Exception {
        mockMvc.perform(get("/api/other-services/filter")
                        .param("city", "Tokio")
                        .param("name", "ServicioInventado"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testFilterWithNoMatches() throws Exception {
        mockMvc.perform(get("/api/other-services/filter")
                        .param("name", "ServicioInexistente")
                        .param("city", "CiudadDesconocida")
                        .param("type", "DECORATION"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    @WithMockUser(username = "proveedor1", roles = "SUPPLIER")
    void testDeleteOtherService_withSupplierRole_shouldReturnOk() throws Exception {
        mockMvc.perform(delete("/api/other-services/delete/5"))
                .andExpect(status().isOk())
                .andExpect(content().string("Deleted successfully"));
    }

    @Test
    @WithMockUser(username = "cliente123", roles = "CLIENT")
    void testDeleteOtherService_withClientRole_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(delete("/api/other-services/delete/5"))
                .andExpect(status().isUnauthorized());
    }

    

    
}
