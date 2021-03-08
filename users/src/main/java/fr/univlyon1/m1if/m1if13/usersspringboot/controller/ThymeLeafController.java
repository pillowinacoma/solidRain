package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.BadRequestException;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.UserNotFoundException;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Controller
public class ThymeLeafController {

    @Autowired
    UserDao userDAO;

    @GetMapping(path = {"/users"}, produces = {"text/html"})
    public String getUsers(/*@RequestParam(value = "name",
            defaultValue = "World", required = true) String name, */Model theModel) {
        theModel.addAttribute("users",userDAO.getUsers());
        return "users";
    }
    @GetMapping(path = "/user", produces = {"text/html"})
    public String getUser(@RequestParam("login") String userLogin, Model theModel){
        try{
            Optional<User> u = userDAO.get(userLogin);
            if(!u.isPresent()){
                throw new UserNotFoundException("Le login " + userLogin + " n'a pas été trouvé");
            }if(userLogin == ""){
                throw new BadRequestException("Le login est manquant");
            }
            theModel.addAttribute("user", u.get());
        }catch (UserNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }catch (BadRequestException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bad request ", e);
        }
        return "user";
    }

    }
