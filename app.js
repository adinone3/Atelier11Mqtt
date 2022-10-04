var express = require('express');
var app = express();
var etat = ["", "Off", "Off", "Off", "Off", "Off", "Off"];
var position = 0;
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1883');


app.set('view engine', 'ejs');


app.get('/', function (req, res, next) {
  //res.send("<h1>Bienvenue dans mon super site !</h1>");
  //res.send("<h1>Bienvenue dans mon super site !</h1><a class='nav-link' href='http://localhost:8080/'>Lien vers la page accueil</a>")
  res.render('index');
});

app.get('/contact', function (req, res, next) {
  //partie1//res.send("<h1>Contacter moi: </h1><table><tr><td>Nom:</td><td>Catuneanu</td></tr><tr><td>Prenom:</td><td>Adrian</td></tr><tr><td>Adresss Postale:</td><td>J7R3L7</td></tr><tr><td>Courriel:</td><td>adinone3@gmail.com</td></tr><tr><td>Telephone:</td><td>514-654-0551</td></tr></table><p><a class='nav-link' href='http://localhost:8080/'>Lien vers la page accueil</a></p>");
  res.render('contact');
});

app.get('/module/:nombre', function (req, res, next) {
  position = req.params.nombre;
  if ((position <= 6) && (position >= 1)) {
    //partie1//res.send("Vous êtes dans la section module " + req.params.nombre + "<p><a class='nav-link' href='http://localhost:8080/'>Lien vers la page accueil</a><p>");

    if (etat[position] == "Off") {
      etat[position] = "On";
    }
    else {
      etat[position] = "Off";
    }

    res.render('module', { number: req.params.nombre, state: etat[position] });
  }
  else {
    res.send("<h1>MODULE INCONNU</h1><a class='nav-link' href='/'>Lien vers la page accueil</a>");
  }
});

app.get('/reset', function (req, res, next) {
  for (i = 1; i < 7; i++) {
    etat[i] = "Off";
  }
  res.send("<h1>Tous le modules sont eteints</h1><a class='nav-link' href='/'>Lien vers la page accueil</a>")

});
app.get('/controle', function (req, res, next) {
  //res.send("<h1>Etat de modules :</h1><p>Module 1 : </p><%= state %><a class='nav-link' href='http://localhost:8080/'>Lien vers la page accueil</a>")
  res.render('controle', { module1: etat[1], module2: etat[2], module3: etat[3], module4: etat[4], module5: etat[5], module6: etat[6] });
});

app.use(function (req, res) {
  res.sendStatus(404);
  res.end("ERREUR 404");
});

client.on('connect', function () {
  console.log("MQTT connecté !");
  client.publish('MODULE', 'le serveur js vous dit bonjour');
});

client.subscribe('MODULE/#');

app.listen(8080);
console.log("Le serveur est lance sur le port 8080");
