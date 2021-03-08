package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
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

import javax.naming.AuthenticationException;

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
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:80", "http://localhost:8080", "http://localhost" , "http://192.168.75.9" , "https://192.168.75.9"})
@Controller
public class OperationController {

    @Autowired
    UserDao users;
    JWTHelper jwt;

    /**
     * Procédure de login "simple" d'un utilisateur
     *
     * @param login    Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
     * @param password Le password à vérifier.
     * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
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
    @PostMapping("/login")
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
                throw new UserNotFoundException("Le login " + login + " n'a pas été trouvé");
            }
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mot de passe érronné", e);
        } catch (UserNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Le login " + login + " n'a pas été trouvé", e);
        }
        return result;
    }

    /**
     * Réalise la déconnexion
     */
    @Operation(summary = "Déconnection d'un utilisateur",
            description = "Change le status de l'utilisateur à Déconnecté",
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
     * Méthode destinée au serveur Node pour valider l'authentification d'un utilisateur.
     *
     * @param token  Le token JWT qui se trouve dans le header "Authentication" de la requête
     * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
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
    @GetMapping("/authenticate")
    public ResponseEntity<Void> authenticate(@RequestParam("token") String token, @RequestParam("origin") String origin) {
        String verify = jwt.verifyToken(token, origin);

        if (verify.equals("Not valid")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else if (verify.equals("Bad token")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            HttpHeaders headers = new HttpHeaders();
            headers.add("Access-Control-Expose-Headers", "*");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).headers(headers).build();
        }
    }
}
