# VALIDATION

Exercice 1 

Modifiez la collection salle afin que soient dorénavant validés les documents destinés à y être insérés ; cette validation aura lieu en mode « strict » et portera sur les champs suivants :

- nom sera obligatoire et devra être de type chaîne de caractères.
- capacite sera obligatoire et devra être de type entier (int).
- Dans le champ adresse, les champs codePostal et ville, tous deux de type chaîne de caractères, seront obligatoires.

```JS
db.runCommand(
    {
        collMod: "salles", 
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["nom", "capacite", "adresse.codePostal", "adresse.ville"],
                properties: {
                    nom: {
                        bsonType: "string"
                        description: "doit être une chaîne de caractères et est obligatoire"
                    },
                    capacite: {
                        bsonType: "int",
                        description: "doit être un entier et est obligatoire"
                    },
                    "adresse.codePostal": {
                        bsonType: "string",
                        description: "doit être une chaîne de caractères et est obligatoire"
                    },
                    "adresse.ville": {
                        bsonType: "string",
                        description: "doit être une chaîne de caractères et est obligatoire"
                    }
                }
            }
        }
    }
)

db.runCommand(
    {
        collMod: "salles",
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["nom", "capacite", "adresse.codePostal", "adresse.ville"],
                properties: {
                    nom: {
                    bsonType: "string",
                    description: "doit être une chaîne de caractères et est obligatoire"
                    },
                    capacite: {
                    bsonType: "int",
                    description: "doit être un entier et est obligatoire"
                    },
                    adresse: {
                        bsonType: "object",
                        required: ["codePostal", "ville"],
                        properties: {
                            codePostal: {
                                bsonType: "string",
                                description: "doit être une chaîne de caractères et est obligatoire"
                            },
                            ville: {
                                bsonType: "string",
                                description: "doit être une chaîne de caractères et est obligatoire"
                            }
                        }
                    }
                }
            }
        }
    }
)
```

Que constatez-vous lors de la tentative d’insertion suivante, et quelle en est la cause ?
```JS 
db.salles.insertOne({ "nom": "Super salle", "capacite": 1500, "adresse": { "ville": "Musiqueville" } })

// Nous avons une erreur car nous avons défini plus haut que le field "codePostal" était obligatoire, hors ici il n'est pas renseigné
```

Que proposez-vous pour régulariser la situation ?

```JS
db.salles.insertOne({ "nom": "Super salle", "capacite": 1500, "adresse": { "ville": "Musiqueville", "codePostal": "69000" } })
```



Exercice 2

Rajoutez à vos critères de validation existants un critère supplémentaire : le champ _id devra dorénavant être de type entier (int) ou ObjectId.

```JS
db.runCommand(
    {
        collMod: "salles",
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["nom", "capacite", "adresse.codePostal", "adresse.ville"],
                properties: {
                    "_id": {
                        bsonType: ["int", "objectId"],
                        description: "doit être un entier ou un ObjectId et est obligatoire"
                    },
                    nom: {
                        bsonType: "string",
                        description: "doit être une chaîne de caractères et est obligatoire"
                    },
                    capacite: {
                        bsonType: "int",
                        description: "doit être un entier et est obligatoire"
                    },
                    adresse: {
                        bsonType: "object",
                        required: ["codePostal", "ville"],
                        properties: {
                            codePostal: {
                                bsonType: "string",
                                description: "doit être une chaîne de caractères et est obligatoire"
                            },
                            ville: {
                                bsonType: "string",
                                description: "doit être une chaîne de caractères et est obligatoire"
                            }
                        }
                    }
                }
            }
        }
    }
)
```

Que se passe-t-il si vous tentez de mettre à jour l’ensemble des documents existants dans la collection à l’aide de la requête suivante :

```JS
db.salles.updateMany({ }, { $set: { "verifie": true } })

// Une erreur apparait en nous disant qu'il y a eu une erreur lors de la validation
// Certains de nos documents créé avant la validation, n'avaient pas certains fields: "adresse.codePostal" et "adresse.ville"
```

Supprimez les critères rajoutés à l’aide de la méthode delete en JavaScript

```JS
var validator = db.getCollectionInfos( { name: "salles" } )[0].options.validator

delete validator.$jsonSchema.properties._id

db.runCommand({ collMod: "salles", validator: validator })
```



Exercice 3

Rajoutez aux critères de validation existants le critère suivant :

- Le champ smac doit être présent OU les styles musicaux doivent figurer parmi les suivants : "jazz", "soul", "funk" et "blues".

```JS
db.runCommand(
    {
        collMod: "salles",
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["nom", "capacite", "adresse.codePostal", "adresse.ville"],
                properties: {
                    "_id": {
                        bsonType: ["int", "objectId"],
                        description: "doit être un entier ou un ObjectId et est obligatoire"
                    },
                    nom: {
                        bsonType: "string",
                        description: "doit être une chaîne de caractères et est obligatoire"
                    },
                    capacite: {
                        bsonType: "int",
                        description: "doit être un entier et est obligatoire"
                    },
                    adresse: {
                        bsonType: "object",
                        required: ["codePostal", "ville"],
                        properties: {
                            codePostal: {
                                bsonType: "string",
                                description: "doit être une chaîne de caractères et est obligatoire"
                            },
                            ville: {
                                bsonType: "string",
                                description: "doit être une chaîne de caractères et est obligatoire"
                            }
                        }
                    },
                    smac: {
                        bsonType: "string"
                    },
                    styles: {
                        bsonType: "array",
                        items: {
                            enum: ["jazz", "soul", "funk", "blues"]
                        }
                    }
                }
            }
        }
    }
)

var test = db.getCollectionInfos( { name: "salles" } )[0].options.validator

test.$or = [
    {
        "smac" : {
            "$exists" : true
        }
    },
    {
        "styles" : {
            "$exists" : true
        }
    }
]

db.runCommand({ collMod: "salles", validator: test })
```

Que se passe-t-il lorsque nous exécutons la mise à jour suivante ?

```JS
db.salles.update({ "_id": 3 }, { $set: { "verifie": false } })

// Aucune erreur avec la ligne du dessus, mais si nous essayons de supprimer les fields "styles" et "smac" de l'un de nos documents, nous avons une erreur, qui nous dit que l'un des 2 fields est obligatoire
```