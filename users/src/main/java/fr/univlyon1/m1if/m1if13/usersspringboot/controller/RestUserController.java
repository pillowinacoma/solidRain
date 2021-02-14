package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import com.auth0.jwt.interfaces.Claim;
import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.UserNotFoundException;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.utils.JWTHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.Set;


@RestController
public class RestUserController {

    @Autowired
    UserDao userDAO;


    @GetMapping(path = "/user",
            headers = "Accept=application/json, application/xml",
            consumes = {"application/x-www-form-urlencoded"},
            produces={"application/json", "application/xml"})
    public ResponseEntity<Object> getUser(@RequestParam("login") String userLogin){
        ResponseEntity<Object> responseEntity = null;
        try{
            Optional<User> u = userDAO.get(userLogin);
            if(!u.isPresent()){
                throw new UserNotFoundException("Le login " + userLogin + " n'a pas été trouvé");
            }
            responseEntity = ResponseEntity.status(HttpStatus.OK).body(u.get());
        }catch (UserNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }
        return responseEntity;
    }

    @GetMapping(path = "/users",
                headers = "Accept=application/json, application/xml",
                produces={"application/json", "application/xml"})
    public Set<String> getUsers(){
        Set<String> setOfUsers = userDAO.getAll();
        return setOfUsers;
    }

    @PostMapping(path = "/users", consumes = {"application/json", "application/x-www-form-urlencoded"})
    public ResponseEntity<Void> createUser(@RequestParam("login") String login, @RequestParam("password") String password){
        userDAO.save(new User(login, password));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping(path = "user/{login}",
                consumes = {"application/json", "application/x-www-form-urlencoded"})
    public ResponseEntity<Void> updateUser(@PathVariable String login, @RequestHeader("Authorization") String token){
        Map<String, Claim> claims = JWTHelper.getClaims(token);
        String currentLogin = claims.get("login").asString();
        try {
            if (userDAO.get(currentLogin).isPresent()) {
                userDAO.get(currentLogin).get().setLogin(login);
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                throw new UserNotFoundException("Le login " + login + " n'a pas été trouvé");
            }
        }catch(UserNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }
    }


    @DeleteMapping(path = "user/{login}", consumes = {"application/json", "application/x-www-form-urlencoded"})
    public ResponseEntity<Void> deleteUser (@PathVariable String login){
        try {
            if (userDAO.get(login).isPresent()) {
                User u = userDAO.get(login).get();
                userDAO.delete(u);
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                throw new UserNotFoundException("Le login " + login + " n'a pas été trouvé");
            }
        }catch(UserNotFoundException e){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }
    }
}
