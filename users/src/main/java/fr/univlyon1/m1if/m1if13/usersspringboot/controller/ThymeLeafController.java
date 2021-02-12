package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;

@Controller
public class ThymeLeafController {

    @Autowired
    UserDao userDAO;

    @GetMapping({
            "/",
            "/users"
    })
    public String hello(/*@RequestParam(value = "name",
            defaultValue = "World", required = true) String name, */Model theModel) {
        theModel.addAttribute("users",userDAO.getAll());
        return "helloworld";
    }
}
