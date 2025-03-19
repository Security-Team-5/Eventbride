package com.eventbride.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    @Query("SELECT p FROM Payment p WHERE p.eventProperties.id = :eventPropertiesId AND p.paymentType = 'DEPOSIT'")
    public Payment filterByEventPropertiesId(Integer eventPropertiesId);
}
