package com.Code.Spring_Boot_Library.Controllers;

import com.Code.Spring_Boot_Library.requestmodels.AddBookRequest;
import com.Code.Spring_Boot_Library.service.AdminService;
import com.Code.Spring_Boot_Library.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private AdminService adminService;
    private JwtUtil jwtUtil;

    @Autowired
    public AdminController(AdminService adminService, JwtUtil jwtUtil) {
        this.adminService = adminService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization")String token,
                         @RequestBody AddBookRequest addBookRequest)throws Exception{
        String admin= jwtUtil.extractRole(token.substring(7));
        if(admin==null || !admin.equals("ADMIN")){
            throw new Exception("Administration page only");
        }
        adminService.postBook(addBookRequest);
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value = "Authorization")String token,
                                     @RequestParam Long bookId)throws Exception{
        String admin= jwtUtil.extractRole(token.substring(7));
        if(admin==null || !admin.equals("ADMIN")){
            throw new Exception("Administration page only");
        }
        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value = "Authorization")String token,
                                     @RequestParam Long bookId)throws Exception{
        String admin= jwtUtil.extractRole(token.substring(7));
        if(admin==null || !admin.equals("ADMIN")){
            throw new Exception("Administration page only");
        }
        adminService.decreaseBookQuantity(bookId);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value = "Authorization")String token,
                                     @RequestParam Long bookId)throws Exception{
        String admin= jwtUtil.extractRole(token.substring(7));
        if(admin==null || !admin.equals("ADMIN")){
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(bookId);
    }
}
