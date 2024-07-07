
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

### XSS réfléchie ou Reflected XSS :

Sur la page admin.html, le formulaire est sensible aux attaques XSS. Il suffit de mettre une balise script basique (comme ```<script>console.log('test injection XSS');</script>```)  et le JavaScript sera exécuté.

### XSS stockée ou Stored XSS :