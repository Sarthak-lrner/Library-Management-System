package com.Code.Spring_Boot_Library.dao;


import com.Code.Spring_Boot_Library.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment,Long> {

    Payment findByUserEmail(String userEmail);
}
