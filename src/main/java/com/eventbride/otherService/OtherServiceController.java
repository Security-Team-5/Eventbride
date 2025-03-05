package com.eventbride.otherService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eventbride.otherService.OtherService.OtherServiceType;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/other-services")
public class OtherServiceController {

    @Autowired
    private OtherServiceService otherServiceService;
    
    @GetMapping("/filter")
    public List<OtherService> getFilteredOtherServices(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) OtherServiceType type) {
        return otherServiceService.getFilteredOtherServices(name, city, type);
    }
}


