package com.eventbride.otherService;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.eventbride.otherService.OtherService.OtherServiceType;

@Repository
public interface OtherServiceRepository extends JpaRepository<OtherService, Integer> {

    @Query("SELECT o FROM OtherService o WHERE o.id = :id")
    Optional<OtherService> findByIdUsingQuery(@Param("id") Integer id);

    Optional<OtherService> findByName(String serviceName);

    Boolean existsByName(String serviceName);

    List<OtherService> findByUserId(Integer userId);

    List<OtherService> findByCityAvailable(String cityAvailable);

    List<OtherService> findByOtherServiceType(OtherServiceType otherServiceType);

    List<OtherService> findByAvailable(Boolean available);

    @Query("SELECT o FROM OtherService o WHERE " +
    "(:name IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
    "(:city IS NULL OR LOWER(o.cityAvailable) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
    "(:type IS NULL OR o.otherServiceType = :type)")
    List<OtherService> findByFilters(@Param("name") String name, 
                              @Param("city") String city, 
                              @Param("type") OtherService.OtherServiceType type);


    
}
