package com.Code.Spring_Boot_Library.service;

import com.Code.Spring_Boot_Library.dao.HistoryRepository;
import com.Code.Spring_Boot_Library.entity.History;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryService {
    @Autowired
    private HistoryRepository historyRepository;
    public List<History> getUserHistory(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("checkoutDate").descending());
        return historyRepository.findBooksByUserEmail(email, pageable).getContent();
    }

}
