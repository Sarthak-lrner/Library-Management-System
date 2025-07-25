package com.Code.Spring_Boot_Library.responseModels;

import com.Code.Spring_Boot_Library.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoansResponse {
    private Book book;
    private int daysLeft;

    public ShelfCurrentLoansResponse(Book book ,int daysLeft){
        this.book=book;
        this.daysLeft=daysLeft;
    }
}
