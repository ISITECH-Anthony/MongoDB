# EXO

```JS
db.salles.insertMany([
    {
        "_id": 1,
        "nom": "AJMI Jazz Club",
        "adresse": {
            "numero": 4,
            "voie": "Rue des Escaliers Sainte-Anne",
            "codePostal": "84000",
            "ville": "Avignon",
            "localisation": {
                "type": "Point",
                "coordinates": [43.951616, 4.808657]
            }
        },
        "styles": ["jazz", "soul", "funk", "blues"],
        "avis": [{
            "date": new Date('2019-11-01'),
            "note": NumberInt(8)
        },
        {
            "date": new Date('2019-11-30'),
            "note": NumberInt(9)
        }
        ],
        "capacite": NumberInt(300),
        "smac": true
    },
    {
        "_id": 2,
        "nom": "Paloma",
        "adresse": {
            "numero": 250,
            "voie": "Chemin de l'Aérodrome",
            "codePostal": "30000",
            "ville": "Nîmes",
            "localisation": {
                "type": "Point",
                "coordinates": [43.856430, 4.405415]
            }
        },
        "avis": [{
            "date": new Date('2019-07-06'),
            "note": NumberInt(10)
        }
        ],
        "capacite": NumberInt(4000),
        "smac": true
    },
    {
        "_id": 3,
        "nom": "Sonograf",
        "adresse": {
            "voie": "D901",
            "codePostal": "84250",
            "ville": "Le Thor",
            "localisation": {
                "type": "Point",
                "coordinates": [43.923005, 5.020077]
            }
        },
        "capacite": NumberInt(200),
        "styles": ["blues", "rock"]
    }
])
```

Exercice 1

Affichez l’identifiant et le nom des salles qui sont des SMAC.

```JS
db.salles.find({ "smac": true }, { "nom": true })
```



Exercice 2

Affichez le nom des salles qui possèdent une capacité d’accueil strictement supérieure à 1000 places.

```JS
db.salles.find({ "capacite": { $gt: 1000 } }, { "_id": false, "nom": true })
```



Exercice 3

Affichez l’identifiant des salles pour lesquelles le champ adresse ne comporte pas de numéro.
```JS
db.salles.find({ "adresse.numero": null }, { "_id": true })

db.salles.find({ "adresse.numero": { $exists: false } }, { "_id": true })
```



Exercice 4

Affichez l’identifiant puis le nom des salles qui ont exactement un avis.

```JS
db.salles.find({ "avis": { $exists: true, $size: 1 } }, { "nom": true })
```



Exercice 5

Affichez tous les styles musicaux des salles qui programment notamment du blues.
```JS
db.salles.find({ "styles": "blues" }, { "_id": false, "styles": true })
```



Exercice 6

Affichez tous les styles musicaux des salles qui ont le style « blues » en première position dans leur tableau styles.
```JS
db.salles.find({ "styles.0": "blues" }, { "_id": false, "styles": true })
```



Exercice 7

Affichez la ville des salles dont le code postal commence par 84 et qui ont une capacité strictement inférieure à 500 places (pensez à utiliser une expression régulière).
```JS
db.salles.find({ "adresse.codePostal": { $regex: "^84" }, "capacite": { $lt: 500 } }, { "_id": false, "adresse.ville": true })

db.salles.find({ $and: [ { "adresse.codePostal": { $regex: "^84" } }, { "capacite": { $lt: 500 } } ] }, { "_id": false, "adresse.ville": true })
```



Exercice 8

Affichez l’identifiant pour les salles dont l’identifiant est pair ou le champ avis est absent.
```JS
db.salles.find({ $or: [ { "_id": { $mod : [ 2, 0 ] } }, { "avis": { $exists: false } } ] }, { "_id": true })
```



Exercice 9

Affichez le nom des salles dont au moins un des avis comporte une note comprise entre 8 et 10 (tous deux inclus).
```JS
db.salles.find({ "avis": { $elemMatch: { "note": { $gte: 8, $lte: 10 } } } }, { "_id": false, "nom": true })
```



Exercice 10

Affichez le nom des salles dont au moins un des avis comporte une date postérieure au 15/11/2019 (pensez à utiliser le type JavaScript Date).
```JS
db.salles.find({ "avis.date": { $gt: new Date("2019-11-15T00:00:00Z") } }, { "_id": false, "nom": true })
```



Exercice 11

Affichez le nom ainsi que la capacité des salles dont le produit de la valeur de l’identifiant par 100 est strictement supérieur à la capacité.
```JS
// Bon mais pas le droit d'utiliser l'operateur "$where", RIPPPPPP !!!!
db.salles.find({ $where: "(this._id * 100) > this.capacite" }, { "_id": false, "nom": true, "capacite": true })

db.salles.find({ $expr: { $gt: [ { $multiply: ["$_id", 100] }, "$capacite" ] } }, { "_id": false, "nom": true, "capacite": true })
```



Exercice 12

Affichez le nom des salles de type SMAC programmant plus de deux styles de musiques différents en utilisant l’opérateur $where qui permet de faire usage de JavaScript.
```JS
db.salles.find({ $where: "this.smac && this.styles && this.styles.length > 2" }, { "_id": false, "nom": true })
```



Exercice 13

Affichez les différents codes postaux présents dans les documents de la collection salles.
```JS
db.salles.find({}, { "_id": false, "adresse.codePostal": true })
```



Exercice 14

Mettez à jour tous les documents de la collection salles en rajoutant 100 personnes à leur capacité actuelle.
```JS
db.salles.updateMany({}, { $inc: { "capacite": 100 } })
```



Exercice 15

Ajoutez le style « jazz » à toutes les salles qui n’en programment pas.
```JS
db.salles.updateMany({ "styles": { $ne: "jazz" } }, { $push: { "styles": "jazz" } })

db.salles.updateMany({}, { $addToSet: { "styles": "jazz" } })
```



Exercice 16

Retirez le style «funk» à toutes les salles dont l’identifiant n’est égal ni à 2, ni à 3.
```JS
db.salles.updateMany({ "_id": { $nin: [2, 3] } }, { $pull: { "styles": "funk" } })
```



Exercice 17

Ajoutez un tableau composé des styles «techno» et « reggae » à la salle dont l’identifiant est 3.
```JS
db.salles.updateOne({ "_id": { $eq: 3 } }, { $push: { "styles": { $each: [ "techno", "reggae" ] } } })
```



Exercice 18

Pour les salles dont le nom commence par la lettre P (majuscule ou minuscule), augmentez la capacité de 150 places et rajoutez un champ de type tableau nommé contact dans lequel se trouvera un document comportant un champ nommé telephone dont la valeur sera « 04 11 94 00 10 ».
```JS
db.salles.updateMany({ "nom": { $regex: "^[Pp].*$" } }, { $inc: { "capacite": 150 }, $push: { "contact": { "telephone": "04 11 94 00 10" } } })

db.salles.updateMany({ "nom": { $regex: "^[Pp].*$" } }, { $inc: { "capacite": 150 }, $set: { "contact": [{ "telephone": "04 11 94 00 10" }] } })
```



Exercice 19

Pour les salles dont le nom commence par une voyelle (peu importe la casse, là aussi), rajoutez dans le tableau avis un document composé du champ date valant la date courante et du champ note valant 10 (double ou entier). L’expression régulière pour chercher une chaîne de caractères débutant par une voyelle suivie de n’importe quoi d’autre est [^aeiou]+$.
```JS
db.salles.updateMany({ "nom": { $regex: "^[aeiouAEIOU].*$" } }, { $push: { "avis": { "date": new Date(), "note": 10 } } })
```



Exercice 20

En mode upsert, vous mettrez à jour tous les documents dont le nom commence par un z ou un Z en leur affectant comme nom « Pub Z », comme valeur du champ capacite 50 personnes (type entier et non décimal) et en positionnant le champ booléen smac à la valeur « false ».
```JS
db.salles.updateMany({ "nom": { $regex: "^[Zz].*$" } }, { $set: { "nom": "Pub Z", "capacite": 50, "smac": false } }, { upsert: true })
```



Exercice 21

Affichez le décompte des documents pour lesquels le champ _id est de type « objectId ».
```JS
db.salles.find({ "_id": { $type: "objectId" } }, { "nom": true }).count()
```



Exercice 22

Pour les documents dont le champ _id n’est pas de type « objectId », affichez le nom de la salle ayant la plus grande capacité. Pour y parvenir, vous effectuerez un tri dans l’ordre qui convient tout en limitant le nombre de documents affichés pour ne retourner que celui qui comporte la capacité maximale.
```JS
db.salles.find({ "_id": { $not: { $type: "objectId" } } }, { "nom": true }).sort({ "capacite": -1 }).limit(1)
```



Exercice 23

Remplacez, sur la base de la valeur de son champ _id, le document créé à l’exercice 20 par un document contenant seulement le nom préexistant et la capacité, que vous monterez à 60 personnes.
```JS
db.salles.replaceOne({ "_id": ObjectId("63e22dbcde6960031f02d9aa") }, { "nom": "Pub Z", "capacite": 60 })
```



Exercice 24

Effectuez la suppression d’un seul document avec les critères suivants : le champ _id est de type « objectId » et la capacité de la salle est inférieure ou égale à 60 personnes.
```JS
db.salles.deleteOne({ "_id": { $type: "objectId" }, "capacite": { $lte: 60 } })
```



Exercice 25

À l’aide de la méthode permettant de trouver un seul document et de le mettre à jour en même temps, réduisez de 15 personnes la capacité de la salle située à Nîmes.
```JS
db.salles.findOneAndUpdate({ "adresse.ville": { $eq: "Nîmes" } }, { $inc: { "capacite": -15 } })
```
