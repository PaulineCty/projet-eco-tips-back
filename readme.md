# Ecotips

## Qu'est-ce que c'est ?
Eco Tips est une application web qui permet, de manière ludique, à ses utilisateurs de réduire leurs impacts écologiques et de faire des économies. 

## Comment installer le projet ?

### Créer la base de données et importer les données

1. Utiliser la commande `CREATE USER ecotips WITH PASSWORD 'ecotips -h localhost'` afin de créer un utilisateur pour votre BDD.
2. Puis utiliser la commande `CREATE DATABASE ecotips OWNER ecotips -h localhost` afin de créer votre BDD puis CTRL+D.
3. Utiliser la commande `psql -U ecotips -d ecotips -f migration/revert/1.create_tables.sql -h localhost`.
4. Utiliser la commande `psql -U ecotips -d ecotips -f migration/deploy/1.create_tables.sql -h localhost`.
5. Puis utiliser la commande `psql -U ecotips -d ecotips -f data/import_data.sql -h localhost`.

### Créer le fichier .env

1. Créer un fichier .env en reprenant les variables d'environnement se trouvant dans .env.example. Pour la variable `ACCESS_TOKEN_SECRET` générer une chaîne de caractère.

### Installer les dépendances puis lancer le script

1. Installer les dépendances avec la commande `npm install` ou `npm i`.
2. Installer `nodemon` avec `npm install -g nodemon` et `pm2` avec `npm install pm2 -g` si ce n'est pas déjà fait.
3. Exécutez le script npm : `npm run start`.


## Déployer le projet sur une VM Cloud o'Clock

### Installer le projet sur la VM Cloud o'Clock

1. Se rendre sur [https://kourou.oclock.io/ressources/vm-cloud/](). Ouvrir un terminal et y copier la clé SSH renseigné sur le lien précédent (si il y a une demande, dire `yes`).
2. Mettre à jour le système d'exploitation :
   1. Mettre à jour la liste des packages avec `sudo apt-get update` (mot de passe : `par dessus les nuages`).
   2. (Optionnel mais déconseillé car assez chronophage) Mettre à jour les packages `sudo apt-get upgrade`.
3. Vérifier si git est installé avec `git --version`.
4. 
5. 
