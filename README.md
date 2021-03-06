## Introduction
- [Pitch](https://forge.univ-lyon1.fr/m1if13/m1if13-2021/-/blob/master/pitch.md)
- [Architecture](https://forge.univ-lyon1.fr/m1if13/m1if13-2021/-/blob/master/archi.png)

## SpringBoot Server 
- [fichier YAML](https://forge.univ-lyon1.fr/p1400298/m1if13-2021/-/raw/feature/TP2/users-api.yaml) généré par Swagger
- Le repertoire /users contient le code Spring Boot
- Le repertoire /test-cors contient un test avec un client simple
- Le lien vers la documentation Swagger UI en localhost:8080 est [ici](http://localhost:8080/swagger-ui/index.html?configUrl=/users-api/swagger-config)

## Express Server
- le code de la partie serveur express se trouve dans le repertoir /api
- l'api est accessible vers ces liens : [https](https://192.168.75.9/game/), [http](http://192.168.75.9:3376/)
- L'interface permet d'envoyer des requettes admin (send ZZR, send Meteorite, Add/delete Player).
- C'est les users qui créeront leur comptes et l'admin peut les ajouter au jeu quand ils sont connectés.

## VueJs Client

- le code de la partie client est dans le repertoir /client
- il est disponible dans le repertoir /client
- le client est disponible [ici](https://192.168.75.9/) (client pas encore deployé sur la vm à la date du 01/06/2021)
