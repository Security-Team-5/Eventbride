package com.eventbride.dto;

import com.eventbride.otherService.OtherService;
import com.eventbride.venue.Venue;
import lombok.Getter;
import lombok.Setter;
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

    public ServiceDTO(OtherService otherService) {
		this.otherServices = new ArrayList<>();
		this.otherServices.add(new OtherServiceDTO(otherService));
    }

	public ServiceDTO(Venue venue) {
		this.venues = new ArrayList<>();
		this.venues.add(new VenueDTO(venue));
	}

}
