import projectData from './projectData.js';

const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close-btn");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const popupTechnologies = document.getElementById("popup-technologies");
const popupLearned = document.getElementById("popup-learned");
const popupLink = document.getElementById("popup-link");

function openPopup(projectKey) {
  const project = projectData[projectKey];
  if (!project) return;

  popupTitle.textContent = project.title;
  popupDescription.textContent = project.description;
  popupTechnologies.textContent = `Technologies : ${project.technologies}`;
  popupLearned.textContent = `Ce que j'ai appris : ${project.learned}`;
  popupLink.href = project.link;
  popupLink.textContent = 'Voir le Github';

  if (project.site) {
    const popupSiteLink = document.getElementById("popup-site");
    popupSiteLink.href = project.site;
    popupSiteLink.textContent = 'Voir le site';
    popupSiteLink.style.display = '';
  } else {
    const popupSiteLink = document.getElementById("popup-site");
    popupSiteLink.href = project.video;
    popupSiteLink.textContent ='Voir la video'
    popupSiteLink.style.display = '';
  }

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