package com.leadflow.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionResponseDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
}
