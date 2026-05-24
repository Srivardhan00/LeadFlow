package com.leadflow.dtos;

import com.leadflow.utils.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddDiscussionRequest {
    private String content;
    private LocalDateTime followUpAt;
    private Status status;
}
