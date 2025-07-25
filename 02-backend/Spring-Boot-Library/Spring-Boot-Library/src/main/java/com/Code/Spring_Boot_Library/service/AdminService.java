package com.Code.Spring_Boot_Library.service;

import com.Code.Spring_Boot_Library.dao.BookRepository;
import com.Code.Spring_Boot_Library.dao.CheckoutRepository;
import com.Code.Spring_Boot_Library.dao.ReviewRepository;
import com.Code.Spring_Boot_Library.entity.Book;
import com.Code.Spring_Boot_Library.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class AdminService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private ReviewRepository reviewRepository;

    @Autowired
    public AdminService(BookRepository bookRepository, CheckoutRepository checkoutRepository, ReviewRepository reviewRepository) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
    }

    public void increaseBookQuantity(Long bookId)throws Exception{
        Optional<Book> book=bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);
        book.get().setCopies(book.get().getCopies()+1);

        bookRepository.save(book.get());
    }

    public void decreaseBookQuantity(Long bookId)throws Exception{
        Optional<Book> book=bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopiesAvailable()<=0 || book.get().getCopies()<=0){
            throw new Exception("Book not found or Quantity locked");
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);
        book.get().setCopies(book.get().getCopies()-1);

        bookRepository.save(book.get());
    }

    public void postBook(AddBookRequest addBookRequest){
        Book book=new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());
        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book=bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }

        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }

}
