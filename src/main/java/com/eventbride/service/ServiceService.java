package com.eventbride.service;
import com.eventbride.dto.ServiceDTO;
import com.eventbride.otherService.OtherService;
import com.eventbride.otherService.OtherServiceRepository;
import com.eventbride.venue.Venue;
import com.eventbride.venue.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceService {

	@Autowired
	private OtherServiceRepository otherServiceRepository;

	@Autowired
	private VenueRepository venueRepository;

	public ServiceDTO getAllServiceByUserId(Integer userId){
		List<OtherService> allOtherServices = otherServiceRepository.findByUserId(userId);
		List<Venue> allVenues = venueRepository.findByUserId(userId);
		return new ServiceDTO(allOtherServices, allVenues);
	}

}
