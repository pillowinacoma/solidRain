package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import com.auth0.jwt.interfaces.Claim;
import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.UserNotFoundException;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.utils.JWTHelper;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;
import java.util.Set;


@OpenAPIDefinition(
        info = @Info(
                title = "Spring User Docs",
                version = "1.0.0",
                description = "Api qui prend charge des ressources utilisateur(user)"),
        servers = {@Server(description = "localhost", url = "http://localhost:8080"),
                @Server(description = "VM(http)", url ="http://192.168.75.9"),
                @Server(description = "VM(https)", url ="https://192.168.75.9")
        })
@Tag(name = "user", description = "l'API user")
@CrossOrigin(origins = {"http://localhost:3376","http://localhost:3000", "http://localhost:80", "http://localhost:8080", "http://localhost" , "http://192.168.75.9" , "https://192.168.75.9"})
@RestController
public class RestUserController {

    @Autowired
    UserDao userDAO;

    @Operation(summary = "Get user by login", tags = {"user"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "successful operation",
                    content = {@Content(mediaType = "application/json", schema = @Schema(implementation = User.class)),
                            @Content(mediaType = "application/xml", schema = @Schema(implementation = User.class)),
                            @Content(mediaType = "text/html")}),
            @ApiResponse(responseCode = "404", description = "utilisateur non trouvé", content = @Content)})
    @GetMapping(path = "/users/{login}",
            produces = {"application/json", "application/xml"})
    public ResponseEntity<Object> getUser(@Parameter(description = "the login of the user") @PathVariable(name = "login") String userLogin) {
        ResponseEntity<Object> responseEntity = null;
        try {
            Optional<User> u = userDAO.get(userLogin);
            if (!u.isPresent()) {
                throw new UserNotFoundException("Le login " + userLogin + " n'a pas été trouvé");
            }
            responseEntity = ResponseEntity.status(HttpStatus.OK).body(u.get());
        } catch (UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }
        return responseEntity;
    }

    @Operation(summary = "Get all users", tags = {"user"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "utilisateur existe",
                    content = {@Content(mediaType = "application/json", schema = @Schema(name = "users", implementation = UserDao.class)),
                            @Content(mediaType = "application/xml", schema = @Schema(name = "users",implementation = UserDao.class)),
                            @Content(mediaType = "text/html")}) })
    @GetMapping(path = "/users",
            produces = {"application/json", "application/xml"})
    public ResponseEntity<Object> getUsers() {
        ResponseEntity<Object> res = null;
        Set<User> setOfUsers = userDAO.get();
        res = ResponseEntity.status(HttpStatus.OK).body(setOfUsers);
        return res;
    }

    @Operation(summary = "Create user", tags = {"user"})
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User created", content = {@Content}) })
    @PostMapping(path = "/users")
    public ResponseEntity<Void> createUser(@RequestParam("login") String login, @RequestParam("password") String password) {
        userDAO.save(new User(login, password));
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Change user login", tags = {"user"})
    @ApiResponses(value = {
            @ApiResponse(responseCode ="200", description = "successful operation", content = {@Content}),
            @ApiResponse(responseCode = "400", description = "utilisateur non trouvé", content = {@Content})
    })
    @PutMapping(path = "users/{login}")
    public ResponseEntity<Void> updateUser(@PathVariable String login, @RequestHeader("Authorization") String token) {
        Map<String, Claim> claims = JWTHelper.getClaims(token);
        String currentLogin = claims.get("login").asString();
        try {
            if (userDAO.get(currentLogin).isPresent()) {
                userDAO.get(currentLogin).get().setLogin(login);
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                throw new UserNotFoundException("Le login " + login + " n'a pas été trouvé");
            }
        } catch (UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }
    }

    @Operation(summary = "Delete user", tags = {"user"})
    @ApiResponses(value = {
            @ApiResponse(responseCode ="200", description = "successful operation", content = {@Content}),
            @ApiResponse(responseCode = "400", description = "utilisateur non trouvé", content = {@Content})
    })
    @DeleteMapping(path = "users/{login}")
    public ResponseEntity<Void> deleteUser(@PathVariable String login) {
        try {
            if (userDAO.get(login).isPresent()) {
                User u = userDAO.get(login).get();
                userDAO.delete(u);
                return ResponseEntity.status(HttpStatus.OK).build();
            } else {
                throw new UserNotFoundException("Le login " + login + " n'a pas été trouvé");
            }
        } catch (UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found Exception", e);
        }
    }


}
