# AGGREGATION

Exercice 1

Écrivez le pipeline qui affichera dans un champ nommé ville le nom de celles abritant une salle de plus de 50 personnes ainsi qu’un booléen nommé grande qui sera positionné à la valeur « vrai » lorsque la salle dépasse une capacité de 1 000 personnes. Voici le squelette du code à utiliser dans le shell :

```JS
// var pipeline = [ 
//     ... 
// ];

// db.salles.aggregate(pipeline)

db.salles.aggregate([
    {
        $match: {
            "capacite": {
                $gt: 50
            }
        }
    },
    {
        $project: {
            "ville": "$adresse.ville",
            "grande": { $gt: [ "$capacite", 1000 ] }
        }
    }
])
```



Exercice 2

Écrivez le pipeline qui affichera dans un champ nommé apres_extension la capacité d’une salle augmentée de 100 places, dans un champ nommé avant_extension sa capacité originelle, ainsi que son nom.

```JS
db.salles.aggregate([
    {
        $project: {
            "apres_extension": {
                $add: [ "$capacite", 100 ]
            },
            "avant_extension": "$capacite",
            "nom": "$nom"
        }
    }
])

// Utilisation de $concat
db.salles.aggregate([
    {
        $project: {
            "apres_extension": {
                $add: [ "$capacite", 100 ]
            },
            "avant_extension": {
                $concat: [ { $toString: "$capacite" }, " - ", "$nom" ]
            }
        }
    }
])
```



Exercice 3

Écrivez le pipeline qui affichera, par numéro de département, la capacité totale des salles y résidant. Pour obtenir ce numéro, il vous faudra utiliser l’opérateur $substrBytes dont la syntaxe est la suivante :

```JS
// { $substrBytes: [ < chaîne de caractères >, < indice de départ >, < longueur > ] } 

db.salles.aggregate([
    {
        $group: {
            "_id": {
                $substrBytes: [ "$adresse.codePostal", 0, 2 ]
            },
            "capacite": {
                $sum: "$capacite"
            }
        }
    }
])
```



Exercice 4

Écrivez le pipeline qui affichera, pour chaque style musical, le nombre de salles le programmant. Ces styles seront classés par ordre alphabétique.

```JS
db.salles.aggregate([
    {
        $unwind: "$styles"
    },
    {
        $group: {
            "_id": "$styles",
            "number": {
                $sum: 1
            },
        }
    },
    {
        $sort: {
            "_id": 1
        }
    }
])
```



Exercice 5

À l’aide des buckets, comptez les salles en fonction de leur capacité :

- celles de 100 à 500 places
- celles de 500 à 5000 places

```JS
db.salles.aggregate([
    {
        $bucket: {
            groupBy: "$capacite",
            boundaries: [ 100, 500, 5000 ],
            output: {
                "count": { $sum: 1 }
            }
        }
    }
])

db.salles.aggregate([
    {
        $bucket: {
            groupBy: "$capacite",
            boundaries: [ 100, 500, 5000 ],
            output: {
                "count": { $sum: 1 },
                "capacities": {
                    $push: {
                        "nom": "$nom",
                        "capacite": "$capacite"
                    }
                }
            }
        }
    },
])
```



Exercice 6

Écrivez le pipeline qui affichera le nom des salles ainsi qu’un tableau nommé avis_excellents qui contiendra uniquement les avis dont la note est de 10.

```JS
db.salles.aggregate([
    {
        $project: {
            "nom": "$nom",
            "avis_excellents": {
                $filter: {
                    "input": "$avis",
                    "as": "notice",
                    "cond": {
                        $eq: [
                            "$$notice.note",
                            10
                        ]
                    }
                },
            }
        }
    }
])
```
