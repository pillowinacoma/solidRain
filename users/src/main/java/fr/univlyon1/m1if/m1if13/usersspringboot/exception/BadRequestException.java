package fr.univlyon1.m1if.m1if13.usersspringboot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BadRequestException extends  RuntimeException{

    public BadRequestException(String message){
        super(message);
    }
}
