package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.BadTokenException;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.UnauthorizedException;
import fr.univlyon1.m1if.m1if13.usersspringboot.exception.UserNotFoundException;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.utils.JWTHelper;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.naming.AuthenticationException;
import java.net.URI;

@OpenAPIDefinition(
        info = @Info(
                title = "Spring User Docs",
                version = "1.0.0",
                description = "Api qui prend charge des ressources utilisateur(user)"),
        servers = {@Server(description = "localhost", url = "http://localhost:8080"),
                @Server(description = "VM(http)", url ="http://192.168.75.9"),
                @Server(description = "VM(https)", url ="https://192.168.75.9")
        })
@Tag(name = "operation", description = "l'API Operations")
@CrossOrigin(origins = {"http://localhost:3376","http://localhost:3000", "http://localhost:80", "http://localhost:8080", "http://localhost" , "http://192.168.75.9" , "https://192.168.75.9", "https://localhost:3376","https://localhost:3000", "https://localhost:80", "https://localhost:8080", "https://localhost","http://192.168.75.9:3376" , "https://192.168.75.9:3376", "http://192.168.75.9:3000" , "https://192.168.75.9:3000" })
@Controller
public class OperationController {

    @Autowired
    UserDao users;
    JWTHelper jwt;

    /**
     * Proc??dure de login "simple" d'un utilisateur
     *
     * @param login    Le login de l'utilisateur. L'utilisateur doit avoir ??t?? cr???? pr??alablement et son login doit ??tre pr??sent dans le DAO.
     * @param password Le password ?? v??rifier.
     * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien pass??, et le code de statut appropri?? (204, 401 ou 404).
     */
    @Operation(summary = "Connection d'un utilisateur",
            description = "Renvoie le token JWT en cas de succes (204)",
            tags = {"operation"},
            operationId = "login"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation", content = {@Content}),
            @ApiResponse(responseCode = "404", description = "User not found", content = {@Content}),
            @ApiResponse(responseCode = "400", description = "Wrong pass word", content = {@Content})
    })
    @PostMapping(value = "/login")
    public ResponseEntity<Void> login(@RequestParam("login") String login, @RequestParam("password") String password, @RequestHeader("Origin") String origin) throws AuthenticationException {
        ResponseEntity<Void> result;
        boolean userExists = users.get(login).isPresent();

        try {
            if (userExists) {
                User user = users.get(login).get();

                user.authenticate(password);
                String token = jwt.generateToken(user.getLogin(), origin);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Authorization", "Bearer " + token);
                headers.add("Access-Control-Expose-Headers", "Authorization");
                result = ResponseEntity.status(HttpStatus.NO_CONTENT).headers(headers).build();
            } else {
                throw new UserNotFoundException("Le login " + login + " n'a pas ??t?? trouv??");
            }
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe ??rronn??", e);
        } catch (UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Le login " + login + " n'a pas ??t?? trouv??", e);
        }
        return result;
    }

    /**
     * R??alise la d??connexion
     */
    @Operation(summary = "D??connection d'un utilisateur",
            description = "Change le status de l'utilisateur ?? D??connect??",
            tags = {"operation"},
            operationId = "logout"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation", content = {@Content}),
            @ApiResponse(responseCode = "404", description = "User not found", content = {@Content})
    })
    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String auth) {
        String token = auth.substring(7);
        DecodedJWT jwt = JWT.decode(token);
        String loginToDeco = jwt.getClaim("login").asString();
        if (users.get(loginToDeco).isPresent()) {
            users.get(loginToDeco).get().disconnect();
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * M??thode destin??e au serveur Node pour valider l'authentification d'un utilisateur.
     *
     * @param auth  Le token JWT qui se trouve dans le header "Authentication" de la requ??te
     * @param origin L'origine de la requ??te (pour la comparer avec celle du client, stock??e dans le token JWT)
     * @return Une r??ponse vide avec un code de statut appropri?? (204, 400, 401).
     */

    @Operation(summary = "Authentification d'un utilisateur",
            description = "Verifie que le token De l'utilisateur est correct",
            tags = {"operation"},
            operationId = "authenticate")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successful operation", content = {@Content}),
            @ApiResponse(responseCode = "400", description = "Bad token", content = {@Content}),
            @ApiResponse(responseCode = "401", description = "Unauthorised (token non valide)", content = {@Content})
    })
    @GetMapping(value = "/authenticate")
    public ResponseEntity<Void> authenticate(@RequestParam("token") String auth, @RequestParam("origin") String origin) {
        String token = auth.substring(7);
        String verify = jwt.verifyToken(token, origin);
        try{
        if (verify.equals("Not valid")) {
            throw new UnauthorizedException("token pas valide");
        } else if (verify.equals("Bad token")) {
            throw new BadTokenException("Probl??me de verification du token");
        } else if(verify.equals("No Token")){
            throw new BadTokenException("Token n'existe pas");
        }else {
            DecodedJWT jwty = JWT.decode(token);
            String loginToSend = jwty.getClaim("login").asString();
            URI location = ServletUriComponentsBuilder
                    .fromCurrentContextPath().build().toUri();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Location", location.toString() + "/users/" + loginToSend);
            headers.add("Access-Control-Expose-Headers", "Location");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).headers(headers).build();
        }}
        catch(Exception e){
            e.printStackTrace();
            if(e instanceof UnauthorizedException){
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage(), e);
            }else if(e instanceof  BadTokenException){
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
            }else{
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
            }
        }
    }
}
