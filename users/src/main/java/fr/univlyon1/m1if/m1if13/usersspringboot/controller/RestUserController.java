package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import com.auth0.jwt.interfaces.Claim;
import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.utils.JWTHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;
import java.util.Set;


@RestController
public class RestUserController {

    @Autowired
    UserDao userDAO;

    @GetMapping(path = "/users",
                headers = "Accept=application/json, application/xml",
                produces={"application/json", "application/xml"})
    public Set<String> getUsers(){
        Set<String> setOfUsers = userDAO.getAll();
        return setOfUsers;
    }

    @PostMapping(path = "/users")
    public ResponseEntity<Void> createUser(@RequestParam("login") String login, @RequestParam("password") String password){
        userDAO.save(new User(login, password));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(path = "user/{login}")
    public ResponseEntity<Void> updateUser(@PathVariable String login, @RequestHeader("Authorization") String token){
        Map<String, Claim> claims = JWTHelper.getClaims(token);
        String currentLogin = claims.get("login").asString();
        if(userDAO.get(currentLogin).isPresent()){
            userDAO.get(currentLogin).get().setLogin(login);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @DeleteMapping(path = "user/{login}")
    public ResponseEntity<Void> deleteUser (@PathVariable String login){
        if(userDAO.get(login).isPresent()){
            User u = userDAO.get(login).get();
            userDAO.delete(u);
            return ResponseEntity.status(HttpStatus.OK).build();
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
