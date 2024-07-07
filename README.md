
# Important

Pour une utilisation optimale et la bonne visualisation des injections, il est conseillé de lire le README.md en entier avant de lancer le projet.

## Technologies utilisées dans le projet

**Front-end :**

HTML, CSS et JavaScript

**Back-end :**

Node.js : serveur express.


## Vérification des Technologies utilisées

Avant tout, il faut s'assurer que Node.js est installé.

**Node.js**

**Télécharger l'installateur :**

Rendez-vous sur le site officiel de Node.js à l'adresse nodejs.org.

Téléchargez la version LTS (Long Term Support) recommandée pour la plupart des utilisateurs.

**Exécuter l'installateur :**

Une fois le fichier téléchargé, double-cliquez sur l'installateur pour lancer l'installation.

Suivez les instructions à l'écran. Vous pouvez laisser les paramètres par défaut.

**Vérifier l'installation :**

Ouvrez une invite de commandes (cmd) et tapez:

```bash
  node -v
```
Vous devriez voir la version de Node.js installée.


## Lancer le projet

Pour lancer le projet, il faut, en plus de lancer le serveur Node.js, avoir un serveur Web disponible.

Cloner le projet dans le dossier de votre choix :

```bash
  git clone https://github.com/justNuka/pronos-foot.git
```

Aller dans le dossier back-end du projet cloné :

```bash
  cd chemin/vers/le/repo/clone/pronos-foot/back-end
```

Une fois dans le dossier back-end, installez les dépendances Node.js nécessaires :

```bash
  npm install
```

Puis lancez le serveur Node.js avec la commande suivante :

```bash
  npm run dev
```

Pour le serveur Web, il y a plusieurs options, dont les 2 suivantes : 


- Avoir l'un des logiciels suivants **(fortement conseillé pour voir correctement les injections)** : XAMPP ou WAMPP par exemple. Placez le repo cloné dans le dossier htdocs de XAMPP ou WAMPP, et lancez le serveur Web via le pannel de gestion.
- Avoir une extension sur Visual Studio Code : PHP Server, ou encore Live Server *(PHP Server utilise le port 3000 comme le serveur Node.js, il faut donc changer dans les paramètres de l'extension le port utilisé)*.

**Attention : les extensions VSCode injectent du code (notamment Live Server) et font recharger la page juste après la création d'une prédiction, on ne peut donc pas voir le code injecté exécuté proprement.**

---

## Comptes disponibles sur l'app :

| Username  | Password   | Role      |
| :-------- | :-------   | :---------|
| `admin  ` | `admin123` | **Admin** |
| `user   ` | `user123`  | **User**  |


## Vulnérabilités sur l'app

L'app possède 4 vulnérabilités :

- 2 XSS (une réfléchie et une stockée).
- 3 IDOR (une qui permet l'accès à une page à laquelle le user ne devrait pas avoir accès, et une qui permet d'obtenir les informations d'un autre user, et une qui permet de devenir admin).

### XSS réfléchie ou Reflected XSS :

Sur la page admin.html, le formulaire est sensible aux attaques XSS. Il suffit de mettre une balise script basique (comme ```<script>console.log('test injection XSS');</script>```)  et le JavaScript sera exécuté.

### XSS stockée ou Stored XSS :

Sur les pages admin.html ainsi que index.html, si une prédiction a été créée avec une balise script, elle sera exécutée lors du chargement de la page.

### IDOR :

Le site utilise `sessionStorage` pour stocker les informations dont il a besoin (user id, role du user).

Il est donc possible de modifier ces entrées : 

Aller dans la console du navigateur avec un F12 ou inspecter l'élément, console :

```bash
  sessionStorage
```

On obtient un retour comme suit : 

`Storage { userId: "2", role: "user", loggedIn: "true", username: "user", length: 4 }`

On peut ensuite modifier 2 keys : userId et role, pour s'octroyer des permissions, ou accéder aux informations d'un autre user :

```bash
  sessionStorage.setItem('userId', 1)
```

```bash
  sessionStorage.setItem('role', admin)
```

En entrant ces lignes dans la console, on peut maintenant accéder à 2 contenus qui n'étaient destinés à ce user.

## Correction des vulnérabilités

Le code corrigé se trouve dans la branche `correction` du repo.

### Page admin.html :

Il faut pour corriger ces injections, échapper toutes les entrées utilisateur avant de les insérer dans le DOM. Cela peut être fait en utilisant des méthodes sécurisées pour manipuler le DOM plutôt que de directement injecter des HTML non échappés, notamment en utilisant `textContent` au lieu de `innerHTML`. 
`textContent` permet d'afficher tel quel le contenu, pour éviter l'exécution du code. On voir par exemple `<script>console.log('test injection XSS');</script>` d'afficher, et rien dans la console.

Création d'une fonction escapeHtml() pour pouvoir "filtrer" les entrées utilisateurs et ne pas laisser de code dangereux s'exécuter.

### Page index.html : 

Utilisation des mêmes principes que pour la page `admin.html`.

### Correction des IDOR 

- Vérifier l'authentification et l'autorisation côté serveur : les contrôles de sécurité doivent être effectués sur le serveur, car les données côté client peuvent être modifiées par un utilisateur malveillant.
- Ne pas utiliser sessionStorage pour stocker des informations sensibles : utiliser des cookies sécurisés et des sessions côté serveur pour gérer les informations de l'utilisateur.

On utilisera également la librairie `JsonWebToken (JWT)` pour pour gérer les tokens d'authentification et cookie-parser pour accéder aux cookies HTTP-only dans Express.js.
Ces deux bibliothèques sont nécessaires pour garantir une authentification sécurisée en utilisant des cookies HTTP-only et des tokens JWT.

#### Utilisation de JWT et de Cookie-parser :

- JWT (jsonwebtoken) :
    - Génère des tokens JWT lors de la connexion. 
    - Vérifie les tokens JWT pour authentifier les requêtes.

- Cookie-parser :
    - Lit les cookies envoyés par le client. 
    - Utilisé pour extraire le token JWT stocké dans un cookie HTTP-only.

On ajoutera ainsi des fonctions dans le fichier authController.js, qui permettront de vérifier les credentials des utilisateurs afin d'afficher le contenu correct.

Un autre ajout serait d'utiliser `uuid` pour générer des id uniques pour les prédictions (pour le moment un timestamp est utilisé pour avoir un "id unique").