package com.eventbride.venue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Integer> {

    @Query("SELECT v FROM Venue v WHERE " +
    "(:city IS NULL OR LOWER(v.cityAvailable) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
    "(:maxGuests IS NULL OR v.maxGuests <= :maxGuests) AND " +
    "(:surface IS NULL OR v.surface >= :surface)")
    List<Venue> findByFilters(@Param("city") String city, 
                              @Param("maxGuests") int maxGuests, 
                              @Param("surface") double surface);

}
