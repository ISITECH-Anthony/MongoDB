# TP METEO

Jeu de données: Téléchargez ou générez un jeu de données de stations météorologiques, qui incluent la date, la température, la pression atmosphérique, etc.


Préparation des données:

a. Importez les données de stations météorologiques dans MongoDB en utilisant la commande mongoimport.

Les données proviennent de [Kaggle](https://www.kaggle.com/datasets/shiftbc/french-meteo-20182020?select=nr_2020-03.csv).
Je les aies ensuite combiné en un seul et même [fichier](./weather_data.csv) (sur un site el ligne) et j'ai aussi fait un traitement sur les données avec un petit [script js](./index.js) :
- Ajout de valeur manquante
- Changement du format des date

b. Assurez-vous que les données sont bien structurées et propres pour une utilisation ultérieure.

```bash
mongoimport --db=weather_db --collection=data --type=csv --columnsHaveTypes --fields="region.string(),date.date(2006-01-02),temp_max_deg.decimal(),temp_min_deg.decimal(),pressure_hpa.decimal(),wind_kmh.decimal(),wet_percent.decimal(),visibility_km.decimal(),cloud_coverage_percent.decimal()" --file=./TP_Meteo/weather_data.csv
```



Indexation avec MongoDB:

a. Créez un index sur le champ de la date pour améliorer les performances de la recherche. Utilisez la méthode createIndex ().

```JS
db.data.createIndex({ "date": 1 })
```

b. Vérifiez que l'index a été créé en utilisant la méthode listIndexes ().

```JS
// La méthode listIndexes() n'existe pas, mais nous pouvons utiliser la méthode getIndexes()
db.data.getIndexes()

// Si nous voulons utiliser listIndexes il faut faire comme ceci :
db.runCommand ({ listIndexes: "data" })
```



Requêtes MongoDB:

a. Recherchez les stations météorologiques qui ont enregistré une température supérieure à 25°C pendant les mois d'été (juin à août). Utilisez la méthode find () et les opérateurs de comparaison pour trouver les documents qui correspondent à vos critères. 

```JS
db.data.find({
    "date": {
        $gte: new Date("2018-06-01"), // ISODate("2018-06-01")
        $lte: new Date("2018-08-31") // ISODate("2018-08-31")
    },
    "temp_min_deg": {
        $gt: 25
    }
})
```

b. Triez les stations météorologiques par pression atmosphérique, du plus élevé au plus bas. Utilisez la méthode sort () pour trier les résultats.

```JS
db.data.find().sort({ pressure_hpa: -1 })
```



Framework d'agrégation: 

a. Calculez la température moyenne par station météorologique pour chaque mois de l'année. Utilisez le framework d'agrégation de MongoDB pour effectuer des calculs sur les données et grouper les données par mois. 

```JS
db.data.aggregate([
    {
        $group: {
            "_id": {
                "month": {
                    "$month": "$date"
                },
                "region": "$region"
            },
            "avgTempMax": {
                "$avg": "$temp_max_deg"
            },
            "avgTempMin": {
                "$avg": "$temp_min_deg"
            }
        }
    },
    {
        $addFields: {
            "avgTemp": {
                $avg: ["$avgTempMax", "$avgTempMin"]
            }
        }
    },
    {
        $sort: {
            "_id.month": 1,
            "_id.region": 1,
        }
    }
])
```

b. Trouvez la station météorologique qui a enregistré la plus haute température en été. Utilisez le framework d'agrégation de MongoDB pour effectuer des calculs sur les données et trouver la valeur maximale.

```JS
db.data.aggregate([
    {
        $match: {
            "date": {
                "$gte": new Date("2018-06-21"),
                "$lte": new Date("2018-09-22")
            }
        }
    },
    {
        $sort: {
            "temp_max_deg": -1
        }
    },
    {
        $limit: 1
    }
])

db.data.aggregate([
    {
        $match: {
            "date": {
                "$gte": new Date("2018-06-21"),
                "$lte": new Date("2018-09-22")
            }
        }
    },
    {
        $group: {
            "_id": "$region",
            "maxTemp": {
                "$max": "$temp_max_deg"
            }
        }
    },
    {
        $sort: {
            "maxTemp": -1
        }
    },
    {
        $limit: 1
    }
])
```



Export de la base de données:

a. Exportez les résultats des requêtes dans un fichier CSV pour un usage ultérieur. Utilisez la commande mongoexport pour exporter des données de MongoDB.

```bash
mongoexport --db=weather_db --collection=data --csv --out=weather_data_export.csv --fields="_id,region,date,temp_max_deg,temp_min_deg,pressure_hpa,wind_kmh,wet_percent,visibility_km,cloud_coverage_percent"
```
