package com.Code.Spring_Boot_Library.Controllers;

import com.Code.Spring_Boot_Library.entity.Payment;
import com.Code.Spring_Boot_Library.requestmodels.PaymentInfoRequest;
import com.Code.Spring_Boot_Library.service.PaymentService;
import com.Code.Spring_Boot_Library.util.JwtUtil;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {

    private PaymentService paymentService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest) throws StripeException {
        PaymentIntent paymentIntent=paymentService.createPaymentIntent(paymentInfoRequest);
        String paymentStr=paymentIntent.toJson();

        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete(@RequestHeader(value="Authorization")String token) throws Exception{
        String userEmail= jwtUtil.extractEmail(token.substring(7));

        if(userEmail==null){
            throw new Exception("User email is missing");
        }
        return paymentService.stripePayment(userEmail);

    }

}
