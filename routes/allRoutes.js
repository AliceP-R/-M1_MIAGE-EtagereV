var express = require('express');
var router = express.Router();

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


router.post('/liste', function(req, res, next) {
  var pauteur = req.body.auteur;
  var ptitre = req.body.titre;
  var ptheme = req.body.theme;

  console.log("pauteur = "+pauteur+" ptitre = "+ ptitre +" ptheme = " + ptheme);
  res.render('liste', {auteur: pauteur, titre: ptitre, theme: ptheme});
})

router.get('/liste/:categorie/', function(req, res, next) {
  var gcateg = req.params.categorie;
  var ListeObjetLivre= {
    "livres":[]
  };
  var ListeIdLivres= {
    "livre":[]
  };
  var ListeISBN= {
    "isbn":[],
    "lccn":[]
  };

  var url = "https://api-na.hosted.exlibrisgroup.com/primo/v1/pnxs?q=any,contains,book;facet_tlevel,exact,online_resources;facet_lcc,exact,"+categorie+"&lang=fr&offset=1&limit=100&view=brief&addfields=lccn&apikey="+apikey;

  client.get(url, function (data, response) {
    // parsed response body as js object
    //console.log(data);
    for (var i = 0; i < data.docs.length; i++) {
      //Récupère le titre
      ListeObjetLivre.livres[i] = data.docs[i].title;

      //Récupère l'id du livre
      ListeIdLivres.livre[i] = data.docs[i].pnxId;

      if (data.docs[i].lccn) {
        ListeISBN.lccn[i] = data.docs[i].lccn;
      }
      else {
        ListeISBN.isbn[i] = data.docs[i].isbn;
      }
    }
  })

  console.log(gcateg);
  res.render('liste', {categ: gcateg, auteur: null, titre: null, theme: null});
})

module.exports = router;
