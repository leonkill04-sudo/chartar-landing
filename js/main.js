import { siteData } from "../data/content.js";

const toTelHref = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

function renderPhoneList(container) {
  if (!container) return;
  container.innerHTML = siteData.phones
    .map((phone) => `<a href="${toTelHref(phone)}">${phone}</a>`)
    .join("");
}

function initPhoneMenus() {
  const menus = [...document.querySelectorAll(".phone-menu")];

  const closeAll = (except) => {
    menus.forEach((menu) => {
      if (menu === except) return;
      menu.classList.remove("is-open");
      const toggle = menu.querySelector(".phone-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  };

  menus.forEach((menu) => {
    const toggle = menu.querySelector(".phone-toggle");
    const dropdown = menu.querySelector(".phone-dropdown");
    if (!toggle || !dropdown) return;

    renderPhoneList(dropdown);

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = !menu.classList.contains("is-open");
      closeAll(willOpen ? menu : null);
      menu.classList.toggle("is-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));
    });

    dropdown.addEventListener("click", (event) => event.stopPropagation());
  });

  document.addEventListener("click", () => closeAll(null));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll(null);
  });
}

function renderNav() {
  const desktop = document.getElementById("nav-desktop");
  const mobile = document.getElementById("mobile-nav");
  const footerNav = document.getElementById("footer-nav");

  const links = siteData.navLinks
    .map((link) => `<a href="${link.href}">${link.title}</a>`)
    .join("");

  desktop.innerHTML = links;
  mobile.innerHTML = links;
  footerNav.innerHTML = siteData.navLinks
    .map((link) => `<li><a href="${link.href}">${link.title}</a></li>`)
    .join("");
}

function renderContacts() {
  [
    ["header-vk", "footer-vk", siteData.socials.vk],
    ["header-max", "footer-max", siteData.socials.max]
  ].forEach(([headerId, footerId, href]) => {
    document.getElementById(headerId).href = href;
    document.getElementById(footerId).href = href;
  });

  const mailto = `mailto:${siteData.email}`;
  const footerEmail = document.getElementById("footer-email");
  footerEmail.href = mailto;
  document.getElementById("footer-email-text").textContent = siteData.email;

  const footerPhones = document.getElementById("footer-phone-list");
  footerPhones.innerHTML = siteData.phones
    .map((phone) => `<li><a href="${toTelHref(phone)}">${phone}</a></li>`)
    .join("");

  document.getElementById("footer-address").textContent = siteData.location;
  document.getElementById("copyright").textContent =
    `© ${new Date().getFullYear()} ${siteData.name}. Все права защищены.`;
}

function renderHero() {
  document.getElementById("hero-title").innerHTML = siteData.hero.titleHtml;
  document.getElementById("hero-subtitle").textContent = siteData.hero.subtitle;

  const slider = document.getElementById("hero-slider");
  const dots = document.getElementById("hero-dots");

  slider.innerHTML = siteData.hero.slides
    .map(
      (src, index) =>
        `<div class="hero-slide${index === 0 ? " is-active" : ""}" style="background-image:url('${src}')"></div>`
    )
    .join("");

  dots.innerHTML = siteData.hero.slides
    .map(
      (_, index) =>
        `<button type="button" role="tab" aria-label="Слайд ${index + 1}" class="${index === 0 ? "is-active" : ""}" data-index="${index}"></button>`
    )
    .join("");

  const slides = [...slider.querySelectorAll(".hero-slide")];
  const dotButtons = [...dots.querySelectorAll("button")];
  let current = 0;
  let timer;

  const goTo = (index) => {
    slides[current].classList.remove("is-active");
    dotButtons[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dotButtons[current].classList.add("is-active");
  };

  const start = () => {
    timer = window.setInterval(() => goTo(current + 1), 5500);
  };

  const restart = () => {
    window.clearInterval(timer);
    start();
  };

  dotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      goTo(Number(button.dataset.index));
      restart();
    });
  });

  start();
}

function renderAbout() {
  document.getElementById("about-title").textContent = siteData.about.title;
  document.getElementById("about-accent").textContent = siteData.about.accent;
  document.getElementById("about-text").textContent = siteData.about.text;
}

function renderRooms() {
  document.getElementById("rooms-title").textContent = siteData.rooms.title;
  document.getElementById("rooms-subtitle").textContent = siteData.rooms.subtitle;
  document.getElementById("rooms-description").textContent = siteData.rooms.description;

  document.getElementById("rooms-exteriors-title").textContent =
    siteData.rooms.exteriors.title;
  document.getElementById("rooms-interiors-title").textContent =
    siteData.rooms.interiors.title;

  document.getElementById("rooms-exteriors").innerHTML = siteData.rooms.exteriors.images
    .map(
      (item) => `
      <figure class="rooms-shot">
        <img src="${item.src}" alt="${item.alt}" loading="lazy" />
      </figure>
    `
    )
    .join("");

  document.getElementById("rooms-interiors").innerHTML = siteData.rooms.interiors.images
    .map(
      (item) => `
      <figure class="rooms-shot">
        <img src="${item.src}" alt="${item.alt}" loading="lazy" />
      </figure>
    `
    )
    .join("");
}

function renderFood() {
  document.getElementById("food-title").textContent = siteData.food.title;
  document.getElementById("food-description").textContent = siteData.food.description;
  document.getElementById("food-visual").innerHTML = siteData.food.images
    .map(
      (item) => `
      <figure class="food-shot">
        <img src="${item.src}" alt="${item.alt}" loading="lazy" />
      </figure>
    `
    )
    .join("");
  document.getElementById("food-points").innerHTML = siteData.food.points
    .map((point) => `<li>${point}</li>`)
    .join("");
}

function renderServiceCard(service) {
  if (service.slides?.length) {
    return `
      <article class="service-card service-card--slider reveal" data-slider="${service.id || "farm"}">
        <div class="service-slider">
          ${service.slides
            .map(
              (slide, index) => `
            <figure class="service-slide${index === 0 ? " is-active" : ""}">
              <img src="${slide.src}" alt="${slide.alt}" loading="lazy" />
              <figcaption>${slide.caption}</figcaption>
            </figure>
          `
            )
            .join("")}
          <div class="service-slider-dots" role="tablist" aria-label="${service.title}">
            ${service.slides
              .map(
                (slide, index) => `
              <button type="button" role="tab" aria-label="${slide.caption}" class="${index === 0 ? "is-active" : ""}" data-index="${index}"></button>
            `
              )
              .join("")}
          </div>
        </div>
        <div class="service-card-body">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
        </div>
      </article>
    `;
  }

  return `
    <article class="service-card reveal">
      <figure>
        <img src="${service.image}" alt="${service.title}" loading="lazy" />
      </figure>
      <div class="service-card-body">
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </div>
    </article>
  `;
}

function initServiceSliders() {
  document.querySelectorAll(".service-card--slider").forEach((card) => {
    const slides = [...card.querySelectorAll(".service-slide")];
    const buttons = [...card.querySelectorAll(".service-slider-dots button")];
    if (!slides.length || !buttons.length) return;

    let current = 0;
    let timer;

    const goTo = (index) => {
      slides[current].classList.remove("is-active");
      buttons[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      buttons[current].classList.add("is-active");
    };

    const start = () => {
      timer = window.setInterval(() => goTo(current + 1), 3800);
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        goTo(Number(button.dataset.index));
        window.clearInterval(timer);
        start();
      });
    });

    start();
  });
}

function renderServices() {
  document.getElementById("services-grid").innerHTML = siteData.services
    .map(renderServiceCard)
    .join("");

  initServiceSliders();

  const events = siteData.events;
  document.getElementById("events-showcase").innerHTML = `
    <div class="events-copy">
      <h3>${events.title}</h3>
      <p>${events.description}</p>
    </div>
    <div class="events-gallery" id="events-gallery">
      ${events.images
        .map(
          (item, index) => `
        <figure class="events-slide${index === 0 ? " is-active" : ""}" data-index="${index}">
          <img src="${item.src}" alt="${item.alt}" loading="lazy" />
          <figcaption>${item.caption}</figcaption>
        </figure>
      `
        )
        .join("")}
    </div>
    <div class="events-dots" id="events-dots" role="tablist" aria-label="События">
      ${events.images
        .map(
          (item, index) => `
        <button type="button" role="tab" aria-label="${item.caption}" class="${index === 0 ? "is-active" : ""}" data-index="${index}"></button>
      `
        )
        .join("")}
    </div>
  `;

  initEventsCarousel();
}

function initEventsCarousel() {
  const gallery = document.getElementById("events-gallery");
  const dots = document.getElementById("events-dots");
  if (!gallery || !dots) return;

  const slides = [...gallery.querySelectorAll(".events-slide")];
  const buttons = [...dots.querySelectorAll("button")];
  let current = 0;
  let timer;

  const goTo = (index) => {
    slides[current].classList.remove("is-active");
    buttons[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    buttons[current].classList.add("is-active");
  };

  const start = () => {
    timer = window.setInterval(() => goTo(current + 1), 4200);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      goTo(Number(button.dataset.index));
      window.clearInterval(timer);
      start();
    });
  });

  start();
}

function initHeader() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  mobileNav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      mobileNav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

function init() {
  renderNav();
  renderContacts();
  initPhoneMenus();
  renderHero();
  renderAbout();
  renderRooms();
  renderFood();
  renderServices();
  initHeader();
  requestAnimationFrame(initReveal);
}

init();
