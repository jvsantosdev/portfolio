/* =========================================================
   JOÃO VÍTOR — PORTFÓLIO FULL-STACK
   Sem dependências. Só JavaScript puro.
   ========================================================= */
(function () {
  "use strict";

  /* >>> TROQUE AQUI o e-mail que recebe as mensagens do formulário */
  const CONTACT_EMAIL = "joao.vitor.soliveiradev@gmail.com";

  const doc = document.documentElement;
  doc.classList.add("js");

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  /* ---------------------------------------------------------
     1. IDIOMA (PT | EN)
     --------------------------------------------------------- */
  const LANG_KEY = "portfolio-lang";
  const TITLES = {
    pt: "João Vítor Santos de Oliveira — Desenvolvedor Full-stack",
    en: "João Vítor Santos de Oliveira — Full-stack Developer"
  };
  const DESCRIPTIONS = {
    pt: "Portfólio de João Vitor Santos de Oliveira, dev full-stack: React, Next.js, Python, Docker e IA (LLM + RAG).",
    en: "Portfolio of João Vitor Santos de Oliveira, full-stack dev: React, Next.js, Python, Docker and AI (LLM + RAG)."
  };

  let lang = "pt";
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "pt" || saved === "en") lang = saved;
    else if ((navigator.language || "").toLowerCase().indexOf("en") === 0) lang = "en";
  } catch (e) { /* storage indisponível */ }

  const langButtons = $$(".lang__btn");

  function applyLang() {
    doc.lang = lang === "pt" ? "pt-BR" : "en";

    /* textos */
    $$("[data-pt][data-en]").forEach((el) => {
      el.textContent = lang === "pt" ? el.dataset.pt : el.dataset.en;
    });

    /* placeholders */
    $$("[data-ph-pt][data-ph-en]").forEach((el) => {
      el.setAttribute("placeholder", lang === "pt" ? el.dataset.phPt : el.dataset.phEn);
    });

    /* alt de imagens */
    $$("[data-alt-pt][data-alt-en]").forEach((el) => {
      el.setAttribute("alt", lang === "pt" ? el.dataset.altPt : el.dataset.altEn);
    });

    /* rótulos acessíveis */
    $$("[data-aria-pt][data-aria-en]").forEach((el) => {
      /* o botão do menu tem rótulo dinâmico — tratado em setMenu() */
      if (el.id === "navToggle") return;
      el.setAttribute("aria-label", lang === "pt" ? el.dataset.ariaPt : el.dataset.ariaEn);
    });

    langButtons.forEach((btn) => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", String(on));
    });

    document.title = TITLES[lang];
    const meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", DESCRIPTIONS[lang]);

    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }

    syncMenuLabel();
    renderErrors();
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.lang === lang) return;
      lang = btn.dataset.lang;
      applyLang();
    });
  });

  /* ---------------------------------------------------------
     2. NAV: fundo ao rolar + menu mobile
     --------------------------------------------------------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const navLinks = $("#navLinks");

  const MENU_LABELS = {
    open:  { pt: "Abrir menu",  en: "Open menu" },
    close: { pt: "Fechar menu", en: "Close menu" }
  };
  let menuOpen = false;

  function syncMenuLabel() {
    const set = menuOpen ? MENU_LABELS.close : MENU_LABELS.open;
    toggle.setAttribute("aria-label", set[lang]);
  }

  function setMenu(open) {
    menuOpen = open;
    nav.classList.toggle("nav--open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    syncMenuLabel();
  }

  toggle.addEventListener("click", () => setMenu(!menuOpen));
  navLinks.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen) { setMenu(false); toggle.focus(); }
  });

  /* ---------------------------------------------------------
     3. BARRA DE PROGRESSO + estado "rolado"
     --------------------------------------------------------- */
  const bar = $("#progressBar");
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || doc.scrollTop;
      const max = doc.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      nav.classList.toggle("is-scrolled", y > 10);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------------------------------------------------------
     4. LINK ATIVO (observa as seções)
     --------------------------------------------------------- */
  const spyLinks = $$(".nav__link");
  const spied = spyLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && spied.length) {
    const visible = new Set();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      let current = null;
      spied.forEach((section) => { if (visible.has(section)) current = section; });
      spyLinks.forEach((link) => {
        link.classList.toggle("is-active", current !== null && link.getAttribute("href") === "#" + current.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spied.forEach((section) => spy.observe(section));
  }

  /* ---------------------------------------------------------
     5. REVEAL AO ROLAR (com respeito a prefers-reduced-motion)
     --------------------------------------------------------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = $$(".reveal");

  /* escalona os elementos dentro de cada seção */
  reveals.forEach((el) => {
    const parent = el.closest("section") || el.parentElement;
    const group = $$(".reveal", parent);
    const i = Math.max(0, group.indexOf(el));
    el.style.setProperty("--d", Math.min(i, 5) * 80 + "ms");
  });

  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------------------------------------------------------
     6. FORMULÁRIO DE CONTATO
     Validação + abertura do aplicativo de e-mail (sem backend).
     Para usar um backend, substitua o bloco "envio" abaixo.
     --------------------------------------------------------- */
  const form = $("#contactForm");
  const status = $("#formStatus");

  const MSG = {
    name:  { pt: "Escreva seu nome.",           en: "Enter your name." },
    email: { pt: "E-mail inválido.",            en: "Invalid email." },
    short: { pt: "Mensagem muito curta (mín. 10 caracteres).", en: "Message too short (min 10 characters)." },
    sent:  {
      pt: "Seu aplicativo de e-mail foi aberto com a mensagem pronta. Se nada aconteceu, escreva para " + CONTACT_EMAIL + ".",
      en: "Your email app opened with the message ready. If nothing happened, write to " + CONTACT_EMAIL + "."
    }
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const fieldError = { name: "", email: "", message: "" };

  const wrapOf = (input) => input.closest(".field");
  const errOf  = (input) => $("#" + input.getAttribute("aria-describedby"));

  function validateInput(input) {
    const value = input.value.trim();
    if (input.name === "name")  return value.length >= 2 ? "" : "name";
    if (input.name === "email") return EMAIL_RE.test(value) ? "" : "email";
    if (input.name === "message") return value.length >= 10 ? "" : "short";
    return "";
  }

  function renderErrors() {
    $$("input, textarea", form).forEach((input) => {
      const key = fieldError[input.name];
      const box = errOf(input);
      const wrap = wrapOf(input);
      if (box) box.textContent = key ? MSG[key][lang] : "";
      if (wrap) wrap.classList.toggle("is-invalid", Boolean(key));
      input.setAttribute("aria-invalid", String(Boolean(key)));
    });
  }

  function revalidate(input) {
    const key = validateInput(input);
    if (fieldError[input.name] || key) fieldError[input.name] = key;
    renderErrors();
  }

  $$("input, textarea", form).forEach((input) => {
    input.addEventListener("blur", () => {
      fieldError[input.name] = validateInput(input);
      renderErrors();
    });
    input.addEventListener("input", () => {
      if (fieldError[input.name]) {
        fieldError[input.name] = validateInput(input);
        renderErrors();
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = $$("input, textarea", form);
    let firstBad = null;
    inputs.forEach((input) => {
      fieldError[input.name] = validateInput(input);
      if (fieldError[input.name] && !firstBad) firstBad = input;
    });
    renderErrors();

    if (firstBad) { firstBad.focus(); status.textContent = ""; return; }

    const name = $("#f-name").value.trim();
    const email = $("#f-email").value.trim();
    const message = $("#f-msg").value.trim();

    const subject = (lang === "pt" ? "Contato pelo portfólio — " : "Portfolio contact — ") + name;
    const body =
      message + "\n\n— " + name + " (" + email + ")";

    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.textContent = MSG.sent[lang];
  });

  /* ---------------------------------------------------------
     7. ANO DO RODAPÉ
     --------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     início
     --------------------------------------------------------- */
  applyLang();
  syncMenuLabel();
})();
