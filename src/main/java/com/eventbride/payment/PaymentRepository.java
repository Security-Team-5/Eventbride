package com.eventbride.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p FROM Payment p WHERE p.eventProperties.id = :eventPropertiesId AND p.paymentType = 'DEPOSIT'")
    public Payment filterByEventPropertiesId(Integer eventPropertiesId);

    @Query("SELECT p FROM Payment p WHERE p.eventProperties.id IN " +
            "(SELECT ep.id FROM Event e JOIN e.eventProperties ep WHERE e.id = :eventId)")
    public List<Payment> findPaymentsByEventId(Integer eventId);

    @Query("""
                SELECT p FROM Payment p
                JOIN p.eventProperties ep
                LEFT JOIN ep.otherService os
                LEFT JOIN ep.venue v
                WHERE os.user.id = :providerId OR v.user.id = :providerId
            """)
    List<Payment> findPaymentsByProviderUserId(@Param("providerId") Integer providerId);

}
