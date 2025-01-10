window.openMenu = function openMenu() {
  const menu = document.getElementById("menu");
  if (menu.dataset.open === "true" || menu.dataset.midAnimation === "true") {
    return false;
  }

  window.scrollTo({top: 0, left: 0, behavior: "smooth"});

  menu.dataset.open = "true";
  menu.dataset.midAnimation = "true";
  menu.classList.remove('d-none', 'fade-out');
  menu.classList.add('fade-in');

  const openMenuButton = document.getElementById("openMenuButton");
  openMenuButton.classList.add('d-none');

  const closeMenuButton = document.getElementById("closeMenuButton");
  closeMenuButton.classList.remove('d-none');

  const allSections = Array.from(document.querySelectorAll("#sections > div"));
  const allSectionsExceptHero = allSections.slice(1);
  for (const section of allSectionsExceptHero) {
    section.classList.add('d-none');
  }

  setTimeout(() => {
    const heroSection = document.querySelector("#sections > div:first-of-type");
    heroSection.classList.add('d-none');
    menu.dataset.midAnimation = "false";
  }, 500);

  return true;
}

window.closeMenu = function closeMenu() {
  const menu = document.getElementById("menu");
  if (menu.dataset.open === "false" || menu.dataset.midAnimation === "true") {
    return false;
  }

  window.scrollTo({top: 0, left: 0, behavior: "smooth"});

  menu.dataset.open = "false";
  menu.dataset.midAnimation = "true";
  menu.classList.remove('fade-in');
  menu.classList.add('fade-out');

  const closeMenuButton = document.getElementById("closeMenuButton");
  closeMenuButton.classList.add('d-none');

  const openMenuButton = document.getElementById("openMenuButton");
  openMenuButton.classList.remove('d-none');

  const allSections = document.querySelectorAll("#sections > div");
  for (const section of allSections) {
    section.classList.remove('d-none');
  }

  setTimeout(() => {
    menu.classList.add('d-none');
    menu.dataset.midAnimation = "false";
  }, 500);

  return true;
}

window.closeMenuToViewSection = function closeMenuToViewSection() {
  const menu = document.getElementById("menu");
  if (menu.classList.contains('d-none')) {
    return true;
  }
  if (menu.dataset.open === "false" || menu.dataset.midAnimation === "true") {
    return false;
  }

  menu.classList.add('d-none');
  menu.dataset.open = "false";
  menu.dataset.midAnimation = "false";

  const closeMenuButton = document.getElementById("closeMenuButton");
  closeMenuButton.classList.add('d-none');

  const openMenuButton = document.getElementById("openMenuButton");
  openMenuButton.classList.remove('d-none');

  const allSections = document.querySelectorAll("#sections > div");
  for (const section of allSections) {
    section.classList.remove('d-none');
  }

  return true;
}

window.scrollToElementOffset = function scrollToElementOffset(element) {
  const headerOffset = document.getElementById('header').offsetHeight;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.scrollY - headerOffset;
  window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
  });
}

window.scrollToContact = function scrollToContact() {
  const contact = document.getElementById("contact");
  scrollToElementOffset(contact);
}

window.openAboutSection = function openAboutSection() {
  if (!closeMenuToViewSection()) { return; }
  const ourMission = document.getElementById("ourMission");
  scrollToElementOffset(ourMission);
}

window.openServicesSection = function openServicesSection() {
  if (!closeMenuToViewSection()) { return; }
  const services = document.getElementById("services");
  scrollToElementOffset(services);
}

window.openOurEdgeSection = function openOurEdgeSection() {
  if (!closeMenuToViewSection()) { return; }
  const ourEdge = document.getElementById("ourEdge");
  scrollToElementOffset(ourEdge);
}

window.openContactSection = function openContactSection() {
  if (!closeMenuToViewSection()) { return; }
  const contact = document.getElementById("contact");
  scrollToElementOffset(contact);
}

window.showSubmittedForm = function showSubmittedForm(rootElement) {
  const contactForm = rootElement.querySelector('#contactForm');
  const submittedForm = rootElement.querySelector('#submittedForm');

  contactForm.classList.add('fade-out');

  setTimeout(() => {
    submittedForm.classList.remove('d-none', 'fade-out');
    submittedForm.classList.add('fade-in');
    //contactForm.classList.add('d-none');

    contactForm.reset();
    contactForm.disabled = false;
  }, 500);

  logEvent(analytics, 'contact_submitted');
}

window.submitForm = async function submitForm(rootElementId) {
  const rootElement = document.getElementById(rootElementId);

  const contactForm = rootElement.querySelector("#contactForm");
  if (contactForm.disabled) {
    return;
  }
  contactForm.disabled = true;

  const emailField = rootElement.querySelector("#emailField");
  const email = emailField.value;
  emailField.disabled = true;

  const messageField = rootElement.querySelector("#messageField");
  const message = messageField.value;
  messageField.disabled = true;

  const sendButton = rootElement.querySelector("#sendButton");
  sendButton.classList.add("d-none");

  const sendingButton = rootElement.querySelector("#sendingButton");
  sendingButton.classList.remove("d-none");

  let result = null;
  try {
    result = await sendContactEmail(email, message);
  } finally {
    if (!result) {
      contactForm.disabled = false;
      emailField.disabled = false;
      messageField.disabled = false;
      sendButton.classList.remove("d-none");
      sendingButton.classList.add("d-none");
      alert("We were unable to send your message, please try again.");
    } else {
      showSubmittedForm(rootElement);
    }
  }
}

// React doesn't allow onclick="..." so we set it here instead

const openMenuButton = document.getElementById("openMenuButton");
openMenuButton.onclick = openMenu;

const closeMenuButton = document.getElementById("closeMenuButton");
closeMenuButton.onclick = closeMenu;
