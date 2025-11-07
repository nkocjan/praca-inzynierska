package com.bff.bff.dto.api;

import java.util.UUID;
import lombok.Data;

@Data
public class CategoryRepDTO {
    private UUID id;
    private String name;
    private Boolean isActive;
}
