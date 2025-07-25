package com.Code.Spring_Boot_Library.dao;

import com.Code.Spring_Boot_Library.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

public interface HistoryRepository extends JpaRepository<History,Long> {

    Page<History> findBooksByUserEmail(String userEmail, Pageable pageable);

}
