# quiserapresident.fr

Simulateur interactif de l'élection présidentielle française 2027.

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## 🎯 À propos

quiserapresident.fr est un outil de simulation statistique qui permet d'explorer différents scénarios de l'élection présidentielle 2027. Le modèle utilise des simulations de Monte-Carlo pour estimer les probabilités de qualification au second tour et de victoire finale de chaque candidat.

## ✨ Fonctionnalités

- 🗳️ **Simulation interactive** : Configurez les candidats, leurs paramètres et lancez 500 simulations
- 📊 **Visualisations** : Graphiques des trajectoires, probabilités et duels possibles
- ⚙️ **Personnalisable** : Ajustez les points de départ, la dynamique et les paramètres de vote barrage
- 📖 **Transparent** : Méthodologie documentée et code open source

## 🚀 Installation

```bash
# Cloner le dépôt
git clone https://github.com/MalauryB/quiserapresident.git
cd quiserapresident

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🛠️ Technologies

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Recharts** - Graphiques
- **Supabase** - Base de données

## 📝 Méthodologie

Le modèle de simulation repose sur :
- Des blocs idéologiques stables
- Des dynamiques de campagne aléatoires (marche aléatoire)
- Le vote utile en fin de campagne
- Les reports de voix au second tour avec effet de barrage

Consultez la [page méthodologie](https://www.quiserapresident.fr/methodologie) pour plus de détails.

## 📄 Licence

Ce projet est sous licence **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International** (CC BY-NC-SA 4.0).

**Usage non commercial uniquement** - Vous pouvez partager et adapter ce projet librement pour un usage non commercial, à condition de créditer l'œuvre originale et de partager vos modifications sous la même licence.

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :
- Ouvrir une issue pour signaler un bug ou proposer une amélioration
- Soumettre une pull request

## 📧 Contact

Une idée d'amélioration ? [Contactez-nous](https://www.quiserapresident.fr/contact)

---

© quiserapresident.fr 2026
