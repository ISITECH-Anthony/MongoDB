# EXOBOOK

Créez une base de données sample nommée "sample_db" et une collection appelée "employees". Insérez les documents suivants dans la collection "employees":
{ name: "John Doe", age: 35, job: "Manager", salary: 80000 }
{ name: "Jane Doe", age: 32, job: "Developer", salary: 75000 }
{ name: "Jim Smith", age: 40, job: "Manager", salary: 85000 }

```JS
// je sélectionne la db (qui n'existe pas encore)
use sample_db

// je crée la collection "employees" qui me crée ma db (cette ligne n'est pas obligatoire)
db.createCollection("employees")

// insertion des données (si nous n'avons pas fait la commande d'avant, ça va aussi créer la collection "employees")
db.employees.insertMany([
    { name: "John Doe", age: 35, job: "Manager", salary: 80000 },
    { name: "Jane Doe", age: 32, job: "Developer", salary: 75000 },
    { name: "Jim Smith", age: 40, job: "Manager", salary: 85000 }
])
```



Écrivez une requête MongoDB pour trouver tous les documents dans la collection "employees".
```JS
db.employees.find()
```



Écrivez une requête pour trouver tous les documents où l'âge est supérieur à 33.
```JS
db.employees.find({ "age": { $gt: 33 }})
```



Écrivez une requête pour trier les documents dans la collection "employees" par salaire décroissant.
```JS
db.employees.find().sort({ "salary": -1 })
```
source: https://www.mongodb.com/docs/v4.2/reference/method/cursor.sort/#cursor.sort



Écrivez une requête pour sélectionner uniquement le nom et le job de chaque document.
```JS
db.employees.find({}, { "_id": false, "name": true, "job": true })
```



Écrivez une requête pour compter le nombre d'employés par poste.
```JS
db.employees.aggregate({ $group : { "_id" : '$job', "count" : { $sum : 1 } } })
```



Écrivez une requête pour mettre à jour le salaire de tous les développeurs à 80000.
```JS
db.employees.updateMany({ "job": "Developer" }, { $set: { "salary": 80000 } })
```
