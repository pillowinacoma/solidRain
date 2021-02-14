package fr.univlyon1.m1if.m1if13.usersspringboot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Date;

@RestController
@ControllerAdvice
public class CustomResponseExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    public final ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest req) throws  Exception{
        ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), req.getDescription(false));
        return new ResponseEntity<Object>(exceptionResponse, HttpStatus.INTERNAL_SERVER_ERROR);

    }

    @ExceptionHandler(UserNotFoundException.class)
    public final ResponseEntity<Object> handleUserNotFound(UserNotFoundException ex, WebRequest req) throws  Exception{
        ExceptionResponse exceptionResponse = new ExceptionResponse(new Date(), ex.getMessage(), req.getDescription(false));
        return new ResponseEntity<Object>(exceptionResponse, HttpStatus.NOT_FOUND);

    }

}
