# Ecotips

## Qu'est-ce que c'est ?
Eco Tips est une application web qui permet, de manière ludique, à ses utilisateurs de réduire leurs impacts écologiques et de faire des économies. 

## Comment installer le projet ?

### Créer la base de données et importer les données

1. Utiliser la commande `CREATE USER ecotips WITH PASSWORD 'ecotips' -h localhost` afin de créer un utilisateur pour votre BDD.
2. Puis utiliser la commande `CREATE DATABASE ecotips OWNER ecotips -h localhost` afin de créer votre BDD puis CTRL+D.
3. Utiliser la commande `psql -U ecotips -d ecotips -f migration/revert/1.create_tables.sql -h localhost`.
4. Utiliser la commande `psql -U ecotips -d ecotips -f migration/deploy/1.create_tables.sql -h localhost`.
5. Puis utiliser la commande `psql -U ecotips -d ecotips -f data/import_data.sql -h localhost`.

### Créer le fichier .env

1. Créer un fichier .env en reprenant les variables d'environnement se trouvant dans .env.example. Pour les variables `ACCESS_TOKEN_SECRET` et `REFRESH_TOKEN_SECRET` générer une chaîne de caractère de la manière de votre choix.

### Installer les dépendances puis lancer le script

1. Installer les dépendances avec la commande `npm install` ou `npm i`.
2. Installer `nodemon` avec `npm install -g nodemon` et `pm2` avec `npm install pm2 -g` si ce n'est pas déjà fait.
3. Lancer le serveur avec `npm run start`.
4. Pour arrêter le serveur utiliser `npm run stop`.

## Déployer le projet sur une VM Cloud o'Clock

### Installer le projet sur la VM Cloud o'Clock

1. Se rendre sur [https://kourou.oclock.io/ressources/vm-cloud/]() et démarrer sa VM Cloud. Ouvrir un terminal et y copier la clé SSH renseigné sur le lien précédent (si il y a une demande, dire `yes`).
2. Mettre à jour le système d'exploitation :
   1. Mettre à jour la liste des packages avec `sudo apt-get update` (mot de passe : `par dessus les nuages`).
   2. (Optionnel mais déconseillé car assez chronophage) Mettre à jour les packages `sudo apt-get upgrade`.
3. Vérifier si git est installé avec `git --version`.
4. Mettre en place la clé SSH :
   1. Utiliser cette commande `ssh-keygen -t ed25519 -C "your_email@example.com"` en remplaçant par l'email lié à son compte Github puis appuyer trois fois sur la touche Entrée.
   2. Aller dans le dossier .ssh avec `cd .ssh`. Copier la clé qui se trouve dans le fichier de clé privée générée avec `cat id_ed25519.pub`. Copier coller toute la ligne (exemple de ce qui devrait être renvoyé : `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAII3mZpY12sR232vKbCSxm/CopyaMhu5WpajvEpbXs3CK enzo.testa@oclock.io`).
   3. Ajouter cette clé dans le SSH-agent avec `eval "$(ssh-agent -s)"` puis `ssh-add ~/.ssh/id_ed25519`.
   4. Se rendre dans les paramètres de votre profil Github puis dans 'SSH keys' puis cliquer sur "New SSH key" et y coller la clé précédemment copiée. Garder 'Authentification Key' en 'Key type', l'appeler 'VM Cloud' par exemple.
5. Revenir à la racine avec `cd ~` puis cloner le dépôt Github du projet à déployer avec `git clone SSH_adress_du_depot`. Si un mot de passe est demandé il s'agit du mot de passe `student`. Se rendre dans le dossier du dépôt qui vient d'être cloné avec `cd <mon_depot>`.
6. Installer postgresql si ce n'est pas déjà fait :
   1. Utiliser la commande `sudo apt-get install postgresql`. Confirmer avec `Y`.
   2. Lancer le service avec `sudo pg_ctlcluster 12 main start`.
   3. Vérifier que le service tourne avec `sudo systemctl status postgresql`.
7. Créer l'utilisateur et la base de données `ecotips` :
   1. Utiliser la commande `sudo -i -u postgres psql`.
   2. Créer l'utilisateur avec `CREATE USER ecotips WITH PASSWORD 'ecotips';`.
   3. Créer la base de donnée avec `CREATE DATABASE ecotips OWNER ecotips;`.
   4. Vérifier que la BDD et l'utilisateur soit créés avec `\l` puis quitter avec Ctrl+D.
8. Installer NVM avec `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash` si ce n'est pas déjà fait.
9. Quitter la VM en fermant le terminal par exemple puis s'y reconnecter comme à l'étape 1. Vérifier que NVM soit bien installé avec `nvm -v`.
10. Via NVM, installer Node avec `nvm install 18` puis utiliser la commande `nvm use 18` puis `nvm alias default 18`.
11. Vérifier que Node soit bien installé avec `node -v`. S'assurer d'avoir la version 18, si ce n'est pas le cas faire `sudo npm install n -g` puis `sudo n stable`.
12. Vérifier que npm soit bien installé avec `npm -v`.

### Préparer le projet 

1. Installer les dépendances avec `npm i`. 
2. Installer `nodemon` avec `npm install -g nodemon` et `pm2` avec `npm install pm2 -g` si ce n'est pas déjà fait.
3. Copier le .env.example avec `cp .env.example .env` puis `nano .env`. Remplir les variables d'environnement avec '8080' pour 'PORT', 'ecotips' pour 'PGUSER','PGPASSWORD' et 'PGDATABASE'. Pour 'ACCESS_TOKEN_SECRET', générer une chaîne de caractère aléatoire de la manière de votre choix.

### Peupler la base de données (à réaliser à chaque changement sur la BDD)

1. (Optionnel : pas pour la première installation du projet !) Mettre à jour le projet en récupérant la dernière version avec `git pull origin main` (S'assurer d'être sur la branch 'main' juste avant avec `git branch`). Puis installer les potentiels nouveaux packages avec `npm i`.
2. (Optionnel : pas pour la première installation du projet !) Utiliser la commande `sudo -i -u postgres psql` (mot de passe : `par dessus les nuages`).
3. (Optionnel : pas pour la première installation du projet !) Supprimer la base de données avec `DROP DATABASE ecotips;` puis vérifier avec `\l`.
4. (Optionnel : pas pour la première installation du projet !) Créer la base de données avec `CREATE DATABASE ecotips OWNER ecotips;` puis vérifier avec `\l`. Quitter avec Ctrl+D.
5. Utiliser la commande `psql -U ecotips -d ecotips -f migration/deploy/1.create_tables.sql -h localhost` pour créer les tables dans la base de données.
6. Utiliser la commande pour importer les données avec `psql -U ecotips -d ecotips -f data/import_data.sql -h localhost`.
7. Créer deux utilisateurs (email : 'laura.teur@gmail.com' et 'jean.biance@gmail.com', mdp : Azerty123!) en se connectant au serveur et en utilisant la route /sign-up avec Insomnia par exemple ou directement depuis l'IHM côté front. Pour cela réaliser l'étape 11 et connecter vous au serveur (voir étape 2 du prochain chapitre). Une fois les utilisateurs créés, reprendre à l'étape 7.
8. Utiliser la commande `psql -U ecotips -d ecotips -h localhost`.
9. Ajouter des cartes au premier utilisateur créé avec `INSERT INTO user_card ( user_id, card_id, expiration_date) VALUES (3,1,'2023-05-25'), (3,25,'2023-03-05'), (3,48,'2023-02-05'), (3,10,'2023-01-01');`.
10. Passer une des cartes en statut fini avec `UPDATE user_card SET state = true WHERE user_id =3 AND card_id = 25;`.
11. Passer le deuxième utilisateur créé en administrateur avec `UPDATE "user" SET role_id=1 WHERE id=4;`. Quitter avec Ctrl+D.
12. Lancer le serveur avec `npm run start`.
13. Votre BDD est maintenant prête.
14. Pour arrêter le serveur utiliser `npm run stop`.

### Rendre sa VM Cloud publique pour accéder à son adresse HTTP depuis l'exterieur

1. Si besoin, se rendre sur [https://kourou.oclock.io/ressources/vm-cloud/]() appuyer sur 'Rendre la VM Publique'.
2. L'adresse pour y accéder est renseigné sur ce même lien. Vous pouvez maintenant l'utiliser.

### Etapes à réaliser à chaque fois que l'on veut lancer le serveur

1. Se rendre sur [https://kourou.oclock.io/ressources/vm-cloud/](). Ouvrir un terminal et y copier la clé SSH renseignée sur le lien précédent (si il y a une demande, dire `yes`).
2. Se rendre dans le dossier du dépôt du projet avec `cd <mon_depot>`.
3. Si besoin, récupérer la dernière version avec `git pull origin main` (S'assurer d'être sur la branch 'main' juste avant avec `git branch`). Puis installer les packages avec `npm i`.
4. Lancer le serveur avec `npm run start`.
5. Pour arrêter le serveur utiliser `npm run stop`.
