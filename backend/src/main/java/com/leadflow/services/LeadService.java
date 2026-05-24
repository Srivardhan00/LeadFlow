package com.leadflow.services;

import com.leadflow.entities.Lead;
import com.leadflow.repositories.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {
    @Autowired
    private LeadRepository leadRepository;

    public List<Lead> fetchAll(){
        return leadRepository.findAll();
    }
}
