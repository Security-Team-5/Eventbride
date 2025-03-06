package com.eventbride.dto;

import com.eventbride.event.Event;
import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ServiceDTO {
	private List<VenueDTO> venues;
	private List<OtherServiceDTO> otherServices;

	// Constructor para simplificar la creación del DTO
	public ServiceDTO(List<OtherService> otherServices, List<Venue> venues) {
		List<OtherServiceDTO> othserviceDTOs = OtherServiceDTO.fromEntities(otherServices);
		List<VenueDTO> venueDTOs = VenueDTO.fromEntities(venues);

		this.venues = venueDTOs;
		this.otherServices = othserviceDTOs;
	}

}
