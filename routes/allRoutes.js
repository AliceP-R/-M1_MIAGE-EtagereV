var express = require('express');
var router = express.Router();
const assert = require('assert');

// Permet de récupérer des données envoyer par la méthode POST
var server = express();
var bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true }));

// Client pour contacter le webservice
var Client = require('node-rest-client').Client;
var client = new Client();
var apikey="l7xx65f8f85e057848b5ae0c71421076a229";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Etagère Virtuelle' });
})

router.all('/resultat/:categorie/', function(req, res, next) {

  var gcateg = req.params.categorie;
  var pauteur = req.body.auteur;
  var ptitre = req.body.titre;
  var ptheme = req.body.theme;

  var ListeObjetLivre= {
    "titre":[]
  };
  var ListeIdLivres= {
    "id":[]
  };
  var ListeISBN= {
    "isbn":[],
    "lccn":[]
  };

  var url = "https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?q=any,contains,book;facet_tlevel,exact,online_resources;facet_lcc,exact,";
  if(gcateg == "null")
  {
    gcateg = "";
  }
  else
      url=url+gcateg+"&";

  url=url+"lang=fr&offset=1&limit=100&view=brief&addfields=lccn&apikey="+apikey;

  client.get(url, function (data, response) {
    // On décortique la réponse en un objet Javascript
    // Pour chaque livre
    for (var i = 0; i < data.docs.length; i++) {
      //On récupère le titre
      ListeObjetLivre.titre[i] = data.docs[i].title;

      //on recupère l'id
      ListeIdLivres.id[i] = data.docs[i].pnxId;

      // on recupère l'ISBN ou le LCCN
      if (data.docs[i].lccn) {
        ListeISBN.lccn[i] = data.docs[i].lccn;
      }
      else {
        ListeISBN.isbn[i] = data.docs[i].isbn;
      }
    }

    res.render('resultat', {categ: gcateg, auteur: pauteur, titre: ptitre, theme: ptheme, listelivres: ListeObjetLivre, listeISBN: ListeISBN});
  })


})

module.exports = router;
