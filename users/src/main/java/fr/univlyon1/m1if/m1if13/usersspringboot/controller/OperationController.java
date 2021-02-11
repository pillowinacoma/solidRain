package fr.univlyon1.m1if.m1if13.usersspringboot.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import fr.univlyon1.m1if.m1if13.usersspringboot.DAO.UserDao;
import fr.univlyon1.m1if.m1if13.usersspringboot.model.User;
import fr.univlyon1.m1if.m1if13.usersspringboot.utils.JWTHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;
import java.util.Map;

@Controller
public class OperationController {

    // TODO récupérer le DAO...
    @Autowired
    UserDao users;
    JWTHelper jwt;

    /**
     * Procédure de login "simple" d'un utilisateur
     * @param login Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
     * @param password Le password à vérifier.
     * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
     */
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestParam("login") String login, @RequestParam("password") String password, @RequestHeader("Origin") String origin) throws AuthenticationException {
        // TODO
        Boolean userExists = users.get(login).isPresent();

        if(userExists) {
            User user = users.get(login).get();

            try {
                user.authenticate(password);
                String token = jwt.generateToken(user.getLogin(), origin);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Authentication", token);
                return ResponseEntity.status(HttpStatus.NO_CONTENT).headers(headers).build();
            } catch (AuthenticationException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Réalise la déconnexion
     */
    @DeleteMapping("/logout")
    public ResponseEntity<Void> logout(@RequestParam("token") String token) {
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
     * @param token Le token JWT qui se trouve dans le header "Authentication" de la requête
     * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
     * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
     */
    @GetMapping("/authenticate")
    public ResponseEntity<Void> authenticate(@RequestParam("token") String token, @RequestParam("origin") String origin) {
        String verify = jwt.verifyToken(token, origin);

        if(verify.equals("Not valid")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else if (verify.equals("Bad token")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
}
