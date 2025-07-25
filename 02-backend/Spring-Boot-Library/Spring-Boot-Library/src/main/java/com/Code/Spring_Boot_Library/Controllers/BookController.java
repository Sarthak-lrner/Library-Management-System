package com.Code.Spring_Boot_Library.Controllers;

import com.Code.Spring_Boot_Library.entity.Book;
import com.Code.Spring_Boot_Library.responseModels.ShelfCurrentLoansResponse;
import com.Code.Spring_Boot_Library.service.BookService;
import com.Code.Spring_Boot_Library.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController{
    private BookService bookService;

    private JwtUtil jwtUtil;

    @Autowired
    public BookController(BookService bookService, JwtUtil jwtUtil) {
        this.bookService = bookService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse>currentLoans(@RequestHeader(value = "Authorization")String token)throws Exception{
        String userEmail=jwtUtil.extractEmail(token.substring(7));
        return bookService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization")String token){
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        return bookService.currentLoansCount(userEmail);
    }
    @GetMapping("/secure/ischeckedout/byuser")
    public boolean checkoutBookByUser(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId){
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        return bookService.checkoutBookByUser(userEmail,bookId);
    }
    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId) throws Exception{
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        return bookService.checkoutBook(userEmail,bookId);
    }
    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId) throws Exception{
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        bookService.returnBook(userEmail,bookId);
    }
    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization")String token,@RequestParam Long bookId) throws Exception{
        String userEmail= jwtUtil.extractEmail(token.substring(7));
        bookService.renewLoan(userEmail,bookId);
    }
}
