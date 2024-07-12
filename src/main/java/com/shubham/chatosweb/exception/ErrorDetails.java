package com.shubham.chatosweb.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@AllArgsConstructor
@NoArgsConstructor
public class ErrorDetails {

    private String error;
    private String message;
    private LocalDateTime timestamp;
}
