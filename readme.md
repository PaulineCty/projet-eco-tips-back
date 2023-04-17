# Ecotips

## Qu'est-ce que c'est ?
Eco Tips est une application web qui permet, de manière ludique, à ses utilisateurs de réduire leurs impacts écologiques et de faire des économies. 

## Comment installer le projet ?

### Créer la base de données et importer les données

1. Utiliser la commande `CREATE USER ecotips WITH PASSWORD 'ecotips -h localhost'` afin de créer un utilisateur pour votre BDD.
2. Puis utiliser la commande `CREATE DATABASE ecotips OWNER ecotips -h localhost` afin de créer votre BDD puis CTRL+D.
3. Utiliser la commande `psql -U ecotips -d ecotips -f migration/revert/1.create_tables.sql -h localhost`.
3. Utiliser la commande `psql -U ecotips -d ecotips -f migration/deploy/1.create_tables.sql -h localhost`.
4. Puis utiliser la commande `psql -U ecotips -d ecotips -f data/import_data.sql -h localhost`.

### Créer le fichier .env

1. Créer un fichier .env en reprenant les variables d'environnement se trouvant dans .env.example. Pour la variable `ACCESS_TOKEN_SECRET` générer une chaîne de caractère.

### 

1. Installer les dépendances avec la commande `npm install` ou `npm i`.
2. Exécutez le script npm : `npm run start`.
