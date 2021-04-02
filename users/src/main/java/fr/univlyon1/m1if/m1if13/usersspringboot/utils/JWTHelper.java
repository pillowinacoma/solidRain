package fr.univlyon1.m1if.m1if13.usersspringboot.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.web.bind.annotation.RequestHeader;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

/**
 * Classe qui centralise les opérations de validation et de génération d'un token "métier", c'est-à-dire dédié à cette application.
 *
 * @author Lionel Médini
 */
public class JWTHelper {
    private static final String SECRET = "monbeausecret";
    private static final String ISSUER = "Spring App";
    private static final long LIFETIME = 1800000; // Durée de vie d'un token : 30 secondes
    private static final Algorithm algorithm = Algorithm.HMAC256(SECRET);

    /**
     * Vérifie l'authentification d'un utilisateur grâce à un token JWT
     *
     * @param token le token à vérifier
     * @param origin   la requête HTTP (nécessaire pour vérifier si l'origine de la requête est la même que celle du token
     * @return un booléen qui indique si le token est bien formé et valide (pas expiré) et si l'utilisateur est authentifié
     */
    public static String verifyToken(String token, @NotNull String origin) throws NullPointerException, JWTVerificationException {
        JWTVerifier authenticationVerifier = JWT.require(algorithm)
                .withIssuer(ISSUER)
                .withClaim("origin", origin) // Non-reusable verifier instance
                .build();
        try {
            authenticationVerifier.verify(token); // Lève une NullPointerException si le token n'existe pas, et une JWTVerificationException s'il est invalide
            DecodedJWT jwt = JWT.decode(token); // Pourrait lever une JWTDecodeException mais comme le token est vérifié avant, cela ne devrait pas arriver
            return jwt.getClaim("login").asString();
        } catch (Exception e) {
            if(e instanceof JWTVerificationException) {
                return "Not valid";
            } else if(e instanceof NullPointerException){
                return "No Token";
            } else {
                return "Bad token";
            }
        }

    }

    /**
     * Crée un token avec les caractéristiques de l'utilisateur
     *
     * @param login le login de l'utilisateur
     * @param origin     la requête HTTP pour pouvoir en extraire l'origine avec getOrigin()
     * @return le token signé
     * @throws JWTCreationException si les paramètres ne permettent pas de créer un token
     */
    public static String generateToken(String login, String origin) throws JWTCreationException {
        return JWT.create()
                .withIssuer(ISSUER)
                .withClaim("login", login)
                .withClaim("origin", origin)
                .withExpiresAt(new Date(new Date().getTime() + LIFETIME))
                .sign(algorithm);
    }


    /**
     * Retourne la liste des claims dans le payload du token
     *
     * @param token le token
     */
    public static Map<String, Claim> getClaims (String token) throws NullPointerException, JWTVerificationException{
       try {
           JWTVerifier verifier = JWT.require(algorithm).withIssuer(ISSUER).build();
           return verifier.verify(Objects.requireNonNull(token)).getClaims();
       }catch(Exception e){
           e.printStackTrace();
           return null;
       }
    }
}

