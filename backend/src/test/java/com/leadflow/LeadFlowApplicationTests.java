package com.leadflow;

import com.leadflow.entities.Lead;
import com.leadflow.services.LeadService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AutoClose;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class LeadFlowApplicationTests {

    @Autowired
    private LeadService leadService;

    @Test
    @Transactional
	void checkFetch(){
        List<Lead> leads = leadService.fetchAll();
        for(Lead lead:leads){
            System.out.println(lead);
        }
    }
}
