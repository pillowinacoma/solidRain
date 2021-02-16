package fr.univlyon1.m1if.m1if13.usersspringboot.exception;

import java.util.Date;

public class ExceptionResponse {
    private Date timeStamp;
    private String message;
    private String details;

    public ExceptionResponse(Date timeStamp, String message, String details){
        super();
        this.timeStamp = timeStamp;
        this.message = message;
        this.details = details;
    }

    public Date getTimeStamp(){
        return timeStamp;
    }

    public String getDetails() {
        return details;
    }

    public String getMessage() {
        return message;
    }
}
