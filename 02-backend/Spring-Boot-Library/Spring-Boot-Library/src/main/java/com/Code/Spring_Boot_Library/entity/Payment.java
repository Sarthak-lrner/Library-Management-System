package com.Code.Spring_Boot_Library.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name="payment")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name="amount")
    private double amount;
}
