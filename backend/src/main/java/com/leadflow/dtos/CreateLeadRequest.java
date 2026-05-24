package com.leadflow.dtos;

import com.leadflow.utils.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateLeadRequest {
    private String fullName;
    private String company;
    private String phoneNumber;
    private Status status = Status.NEW;
}
