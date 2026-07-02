const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close-btn");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const popupTechnologies = document.getElementById("popup-technologies");
const popupLearned = document.getElementById("popup-learned");
const popupLink = document.getElementById("popup-link");

const projectData = {
  red: {
    title: 'Projet RED',
    description: 'Un jeu créer en Golang tour par tour qui se déroule dans le terminal, je me suis occupé de la partie animations et du style.',
    link: 'https://github.com/Alexanger300/projet-red_Arden',
    technologies: 'Le jeu est codé en Golang.',
    learned: 'Ce projet m\'a appris à développer en Golang et à créer une expérience utilisateur plus immersive dans un terminal.'
  },
  calysta: {
    title: 'Calysta',
    description: 'Calysta est un projet Ydays qui consiste à installer des salles de repos dans les lieux scolaires ; je me suis occupé du site web.',
    link: 'https://github.com/Alexanger300/CalystaV2',
    technologies: 'J\'ai codé le site en HTML, CSS et JavaScript.',
    learned: 'Ce projet m\'a appris à créer un site web complet et à utiliser Vercel pour son déploiement.'
  },
  'groupie-tracker': {
    title: 'Projet Groupie-Tracker',
    description: 'Un site qui utilise une API pour retrouver des groupes musicaux ainsi que leurs informations et leurs concerts. Je me suis occupé du front-end du site web.',
    link: 'https://github.com/333-m93/groupie-tracker',
    technologies: 'Durant ce projet, j\'ai utilisé du HTML, CSS et du JavaScript.',
    learned: 'Ce projet m\'a appris à créer un visuel attractif et une interface dynamique avec JavaScript.'
  }
};

function openPopup(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;

  popupTitle.textContent = project.title;
  popupDescription.textContent = project.description;
  popupTechnologies.textContent = `Technologies : ${project.technologies}`;
  popupLearned.textContent = `Ce que j'ai appris : ${project.learned}`;
  popupLink.href = project.link;
  popupLink.textContent = 'Voir le projet';

  popup.classList.add('open');
  popup.setAttribute('aria-hidden', 'false');
  document.body.classList.add('popup-open');
}

function closePopup() {
  popup.classList.remove('open');
  popup.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('popup-open');
}

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', () => openPopup(card.dataset.project));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPopup(card.dataset.project);
    }
  });
});

if (closeBtn) {
  closeBtn.addEventListener('click', closePopup);
}

if (popup) {
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && popup?.classList.contains('open')) {
    closePopup();
  }
});