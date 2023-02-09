# Bonus :

## Créer une collection et la renommer :

```JS
db.createCollection("maCollection")

db.maCollection.renameCollection("maCollectionTest")
```

source: https://www.mongodb.com/docs/manual/reference/method/db.collection.renameCollection/



## FindAndModify :

FindAndModify nous permet de trouver et de modifer un document.

Il peut modifier le document de plusieurs manière :
- Faire une update
- Faire un replace
- Faire un delete

source: https://www.mongodb.com/docs/manual/reference/method/db.collection.findAndModify/



## Lever une erreur qui permet de vérifier que les shémas de validation appliqués fonctionnent

Pour tous les tests avec les shémas de validation, regarder le fichier [exercices/validation.md](./exercices/VALIDATION.md)



## Gagner du temps avec des index

Pour faire le test avec ou sans index il faut créer une nouvelle collection ("comments")
Vous pouvez utiliser les données de ce fichier json [comments.json](./comments.json)

```JS
db.comments.find({ "email": "lena_headey@gameofthron.es" }).explain("executionStats")

// Pour pouvoir voir le temps que mettent nos requêtes nous allons ajouter à la fin de notre find .explain("executionStats")
// Il va nous permettre de voir combien de temps met notre requête pour récupérer tous les commentaires de cette email

// Si nous exécutons la commande find ci dessus, un objet nous est retourné une fois la commande terminé
// Nous devons lire l'élément executionStats.executionTimeMillis, pour ma part la valeur est 39

// Nous pouvons ensuite créer un index sur notre field "email" avec la commande ci-dessous
db.comments.createIndex({ "email": 1 }, { "name": "index_meail" })

// Si nous voulons supprimer l'index créer voici la commande
db.comments.dropIndex("index_meail")

// Une fois notre index créé, nous pouvons relancer la première commande 
// Dans l'objet qui nous est retourné nous allons voir à nouveau l'élément "executionStats.executionTimeMillis", qui cette fois-ci, a pour ma part la valeur 2

// Nous pouvons donc voir que si nous utilisons les index correctement nous pouvons mettre beaucoup moins de temps
```


## En quoi il y a un arrondi dans le code ci-dessous

```JS
db.achats.aggregate([
    {
        $addFields: {
            "total_achats": { $sum: "$achats" },
            "total_reduc": { $sum: "$reductions" }
        } 
    }, 
    {
        $addFields: {
            "total_final": {
                $subtract: [ "$total_achats",  "$total_reduc" ]
            }
        }
    },
    {
        $project: {
            "_id": 0,
            "nom": 1,
            "prenom":1,
            "Total payé": "$total_final"
        }  
    }  
])

db.achats.aggregate([
    {
        $addFields: { 
            "total_achats": { 
                $sum: "$achats"
            }, 
            "total_reduc": { 
                $sum: "$reductions"
            }
        }
    }, 
    {
        $addFields: { 
            "total_final": { 
                $subtract: ["$total_achats", "$total_reduc"] 
            }
        }
    },
    {
        $addFields: { 
            "Total payé": { 
                $divide: [
                    { 
                        $subtract: [
                            { $multiply: ['$total_final', 100] }, 
                            {
                                $mod: [ 
                                    { $multiply: ['$total_final', 100] }, 
                                    1
                                ] 
                            }
                        ] 
                    }, 
                    100
                ]
            }
        }
    }
])
```

La suite d'utilisation des opérateurs d'agrégation arithmétique dans le code ci-dessus permettent de seulement afficher le résultat avec 2 chiffres après la virgule
