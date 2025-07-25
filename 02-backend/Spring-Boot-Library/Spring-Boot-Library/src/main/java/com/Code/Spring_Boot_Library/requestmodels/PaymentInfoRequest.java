package com.Code.Spring_Boot_Library.requestmodels;

import lombok.Data;

@Data
public class PaymentInfoRequest {

    private int amount;
    private String currency;

    private String receiptEmail;
}
