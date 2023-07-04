Voting DApp
===========

Ce projet est une application décentralisée (DApp) de vote construite avec [Next.js](https://nextjs.org/) et [Ethereum](https://ethereum.org/). Il utilise un contrat intelligent Ethereum pour gérer le processus de vote.

Prérequis
---------

*   Node.js et npm installés sur votre machine.
*   Un compte Ethereum avec des fonds pour le déploiement du contrat (vous pouvez obtenir des Ether gratuits pour le développement sur les réseaux de test Ethereum).
*   Un fournisseur Ethereum comme [Infura](https://infura.io/).
*   [Hardhat](https://hardhat.org/) pour le déploiement du contrat.

Mise en place
-------------

1.  Clonez ce dépôt sur votre machine locale.
2.  Installez les dépendances du projet en exécutant `npm install` dans le répertoire du projet.
3.  Créez un fichier `.env` à la racine du projet et ajoutez-y les variables d'environnement suivantes :

    
    PRIVATE_KEY=your_private_key
    INFURA_PROJECT_ID=your_infura_project_id
    

Remplacez `your_private_key` par la clé privée de votre compte Ethereum et `your_infura_project_id` par l'ID de votre projet Infura.

4.  Déployez le contrat intelligent en exécutant `npx hardhat run scripts/deploy.js --network rinkeby`. Remplacez `rinkeby` par le réseau Ethereum de votre choix.

Démarrage du serveur de développement
-------------------------------------

Exécutez `npm run dev` pour démarrer le serveur de développement. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

Utilisation de l'application
----------------------------

L'application permet aux utilisateurs de s'inscrire en tant qu'électeurs, de proposer des options de vote, de voter pour des propositions et de voir le résultat du vote.

Contrat déployé
---------------

Le contrat Voting a été déployé à l'adresse suivante : `0x53B9ee3f3E7A6785770bA00b44866D589e73E8E7` par le compte `0x48302C82e46e28c839d29eD2c3b4a27f04B44B1c`.

En savoir plus
--------------

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

*   [Documentation de Next.js](https://nextjs.org/docs) - Apprenez-en plus sur les fonctionnalités et l'API de Next.js.
*   [Apprendre Next.js](https://nextjs.org/learn) - Un tutoriel interactif sur Next.js.

Déploiement sur Vercel
----------------------

La manière la plus simple de déployer votre application Next.js est d'utiliser la [Plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation sur le déploiement de Next.js](https://nextjs.org/docs/deployment) pour plus de détails.