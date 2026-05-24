package com.leadflow.dtos;

import com.leadflow.utils.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeadDetailsDTO {
    private Long id;
    private String fullName;
    private String company;
    private String phoneNumber;
    private Status status;
    private LocalDateTime followUpAt;

    private List<DiscussionResponseDTO> discussions;
}
