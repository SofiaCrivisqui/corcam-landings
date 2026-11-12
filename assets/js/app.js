(() => {
  "use strict";

  /* En la portada, el formulario comercial aparece antes de la gama. */
  if (document.body.classList.contains("home-landing")) {
    const contactSection = document.querySelector("#contacto");
    const rangeSection = document.querySelector("#gama");

    if (contactSection && rangeSection) {
      rangeSection.parentNode.insertBefore(contactSection, rangeSection);
    }
  }

  /* ========================================================
     UTILIDADES PARA CREAR ÍCONOS SVG
     ======================================================== */

  const svg = (body, viewBox = "0 0 64 64") => `
    <svg
      viewBox="${viewBox}"
      aria-hidden="true"
      focusable="false"
    >
      ${body}
    </svg>
  `;

  /* ========================================================
     BIBLIOTECA DE ÍCONOS

     Los íconos generales utilizan viewBox 64 × 64.
     Los técnicos utilizan viewBox 48 × 48.
     ======================================================== */

  const icons = {
    /* Financiación */

    coins: svg(`
      <ellipse cx="23" cy="19" rx="15" ry="7"></ellipse>
      <path d="M8 19v9c0 4 7 7 15 7s15-3 15-7v-9"></path>
      <path d="M8 28v9c0 4 7 7 15 7 4 0 8-1 11-2"></path>
    `),

    calendar: svg(`
      <rect x="8" y="13" width="48" height="43" rx="7"></rect>
      <path d="M19 7v12M45 7v12M8 25h48"></path>
    `),

    document: svg(`
      <path d="M17 7h22l12 12v38H17z"></path>
      <path d="M39 7v13h12"></path>
      <path d="M24 31h20M24 40h20M24 49h13"></path>
    `),

    /* Aplicaciones */

    truck: svg(`
      <path d="M8 20h30v25H8z"></path>
      <path d="M38 29h10l8 9v7H38z"></path>
      <circle cx="20" cy="50" r="5"></circle>
      <circle cx="47" cy="50" r="5"></circle>
    `),

    tools: svg(`
      <path d="M38 8a13 13 0 0 0-12 18L8 44a7 7 0 0 0 10 10l18-18A13 13 0 0 0 54 22l-9 9-8-8 9-9A13 13 0 0 0 38 8z"></path>
    `),

    shield: svg(`
      <path d="M32 6l21 9v15c0 14-8 24-21 29C19 54 11 44 11 30V15z"></path>
      <path d="M23 32l6 6 13-15"></path>
    `),

    /* Cabina */

    steering: svg(`
      <circle cx="32" cy="32" r="23"></circle>
      <circle cx="32" cy="32" r="6"></circle>
      <path d="M10 27h16l6 5 6-5h16"></path>
      <path d="M32 38v17"></path>
    `),

    seat: svg(`
      <circle cx="30" cy="10" r="7"></circle>
      <path d="M22 19c8 0 14 5 14 13v6h12v14H18V32c0-7 1-11 4-13z"></path>
      <path d="M36 38l10-12"></path>
    `),

    eye: svg(`
      <path d="M4 32s10-17 28-17 28 17 28 17-10 17-28 17S4 32 4 32z"></path>
      <circle cx="32" cy="32" r="8"></circle>
    `),

    steps: svg(`
      <path d="M10 50h12V38h12V26h12V14h10"></path>
    `),

    bottle: svg(`
      <path d="M14 18h12v38H10V28z"></path>
      <path d="M16 8h8v10h-8z"></path>
      <path d="M39 24h10l5 9v23H34V33z"></path>
    `),

    snow: svg(`
      <path d="M32 4v56M8 18l48 28M8 46l48-28"></path>
    `),

    /* Capacidad y aplicaciones */

    box: svg(`
      <path d="M8 19L32 6l24 13v28L32 59 8 47z"></path>
      <path d="M8 19l24 14 24-14M32 33v26"></path>
    `),

    field: svg(`
      <path d="M5 48c12-7 20-7 27 0 7-7 15-7 27 0"></path>
      <path d="M8 37c10-7 18-7 24 0 7-7 14-7 24 0"></path>
      <path d="M32 8v44"></path>
    `),

    /* Datos técnicos */

    engine: svg(
      `
        <path d="M10 17h6l3-5h13l3 5h4v20H10z"></path>
        <path d="M19 12V8M29 12V8M10 22H6v8h4"></path>
      `,
      "0 0 48 48",
    ),

    gear: svg(
      `
        <circle cx="24" cy="24" r="11"></circle>
        <circle cx="24" cy="24" r="4"></circle>
        <path d="M24 6v7M24 35v7M6 24h7M35 24h7"></path>
      `,
      "0 0 48 48",
    ),

    gearbox: svg(
      `
        <path d="M13 9v30M24 9v30M35 9v30"></path>
        <path d="M13 19h22M13 30h22"></path>
      `,
      "0 0 48 48",
    ),

    weight: svg(
      `
        <path d="M16 19h16l5 20H11z"></path>
        <circle cx="24" cy="12" r="7"></circle>
      `,
      "0 0 48 48",
    ),
  };

  /* ========================================================
     SELECTORES Y CONFIGURACIÓN
     ======================================================== */

  const $ = (selector) => document.querySelector(selector);

  const $$ = (selector) => [
    ...document.querySelectorAll(selector),
  ];

  const config = window.CORCAM_PAGE || {};

  const track = (eventName, data = {}) => {
    window.corcamTrack?.(eventName, data);
  };

  /* ========================================================
     ÍCONOS ESTÁTICOS DE LA PÁGINA
     ======================================================== */

  $$("[data-icon]").forEach((element) => {
    const iconName = element.dataset.icon;

    element.innerHTML = icons[iconName] || "";
  });

  /* ========================================================
     DATOS TÉCNICOS Y VARIANTES
     ======================================================== */

  const technicalTabs = $("#technical-tabs");
  const technicalData = $("#technical-data");

  const renderVariant = (index) => {
    const variant =
      config.variants?.[index] ||
      config.variants?.[0];

    if (!variant || !technicalData) {
      return;
    }

    $$("#technical-tabs button").forEach(
      (button, buttonIndex) => {
        button.classList.toggle(
          "active",
          buttonIndex === index,
        );
      },
    );

    technicalData.innerHTML = variant[1]
      .map(([icon, value, description]) => {
        const selectedIcon =
          icons[icon] || icons.gear;

        return `
          <div class="technical-row">
            <span
              class="spec-icon"
              aria-hidden="true"
            >
              ${selectedIcon}
            </span>

            <strong>${value}</strong>

            <small>${description}</small>
          </div>
        `;
      })
      .join("");
  };

  if (technicalTabs) {
    (config.variants || []).forEach(
      (variant, index) => {
        technicalTabs.insertAdjacentHTML(
          "beforeend",
          `
            <button
              type="button"
              class="${index === 0 ? "active" : ""}"
              data-variant="${index}"
            >
              ${variant[0]}
            </button>
          `,
        );
      },
    );

    renderVariant(0);

    technicalTabs.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest(
          "[data-variant]",
        );

        if (!button) {
          return;
        }

        const variantIndex = Number(
          button.dataset.variant,
        );

        renderVariant(variantIndex);

        track("technical_variant_click", {
          model: config.model,
          variant:
            config.variants?.[variantIndex]?.[0] ||
            "",
        });
      },
    );
  }

  /* ========================================================
     IMAGEN SEGÚN VARIANTE TÉCNICA

     Este bloque se ejecuta solamente en las landings que
     tienen más de una imagen técnica configurada.
     ======================================================== */

  const technicalModelImage = $("#technical-model-image");

  const technicalImagesByLanding = {
    "meteor-28460-29520": {
      0: {
        src: "../assets/images/meteor-28460-29520/meteor-28460.webp",
        alt: "Volkswagen Meteor 28.460",
      },
      1: {
        src: "../assets/images/meteor-28460-29520/meteor-29520.webp",
        alt: "Volkswagen Meteor 29.520",
      },
    },

    "constellation-19330-19360": {
      0: {
        src: "../assets/images/constellation-19330-19360/constellation-19330.webp",
        alt: "Volkswagen Constellation 19.330",
      },
      1: {
        src: "../assets/images/constellation-19330-19360/constellation-19360.webp",
        alt: "Volkswagen Constellation 19.360",
      },
    },
  };

  const technicalImages =
    technicalImagesByLanding[config.model];

  const updateTechnicalImage = (variantIndex) => {
    if (!technicalModelImage || !technicalImages) {
      return;
    }

    const selectedImage =
      technicalImages[variantIndex] || technicalImages[0];

    if (!selectedImage) {
      return;
    }

    technicalModelImage.classList.add("is-changing");

    const preloadImage = new Image();

    preloadImage.onload = () => {
      technicalModelImage.src = selectedImage.src;
      technicalModelImage.alt = selectedImage.alt;

      requestAnimationFrame(() => {
        technicalModelImage.classList.remove(
          "is-changing",
        );
      });
    };

    preloadImage.onerror = () => {
      technicalModelImage.classList.remove(
        "is-changing",
      );
    };

    preloadImage.src = selectedImage.src;
  };

  if (
    technicalTabs &&
    technicalModelImage &&
    technicalImages
  ) {
    updateTechnicalImage(0);

    technicalTabs.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest(
          "[data-variant]",
        );

        if (!button) {
          return;
        }

        updateTechnicalImage(
          Number(button.dataset.variant),
        );
      },
    );
  }

  /* ========================================================
     MENÚ DE MODELOS
     ======================================================== */

  const modelMenu = $("#model-menu");
  const modelTrigger = $(".model-trigger");

  modelTrigger?.addEventListener("click", () => {
    if (!modelMenu) {
      return;
    }

    const isOpening = modelMenu.hidden;

    modelMenu.hidden = !isOpening;

    modelTrigger.setAttribute(
      "aria-expanded",
      String(isOpening),
    );
  });

  /* ========================================================
     MENÚ MOBILE
     ======================================================== */

  $(".mobile-trigger")?.addEventListener(
    "click",
    () => {
      $(".topbar")?.classList.toggle("open");
    },
  );

  /* ========================================================
     BOTONES DE APLICACIONES Y FINANCIACIÓN
     ======================================================== */

  document.addEventListener("click", (event) => {
    const applicationButton =
      event.target.closest("[data-application]");

    const financeButton =
      event.target.closest("[data-finance]");

    if (applicationButton) {
      const applicationField =
        $("#form-application");

      if (applicationField) {
        applicationField.value =
          applicationButton.dataset.application;
      }

      track("application_interest", {
        application:
          applicationButton.dataset.application,
      });

      $("#contacto")?.scrollIntoView({
        behavior: "smooth",
      });
    }

    if (financeButton) {
      const financeField = $("#form-finance");

      if (financeField) {
        financeField.value =
          financeButton.dataset.finance;
      }

      track("finance_interest", {
        finance_option:
          financeButton.dataset.finance,
      });

      $("#contacto")?.scrollIntoView({
        behavior: "smooth",
      });
    }
  });

  /* ========================================================
     DESCARGA DE FICHA TÉCNICA
     ======================================================== */

  $("#technical-download")?.addEventListener(
    "click",
    () => {
      track("technical_sheet_download", {
        model: config.model,
        file_url: config.sheet,
      });
    },
  );

  /* ========================================================
     FORMULARIO
     ======================================================== */

  const leadForm = $("#lead-form");
  let formStarted = false;

  leadForm?.addEventListener("focusin", () => {
    if (formStarted) {
      return;
    }

    formStarted = true;

    track("form_start", {
      model: config.model,
    });
  });

  leadForm?.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      track("generate_lead", {
        selected_model:
          $("#form-model")?.value || "",
        application:
          $("#form-application")?.value || "",
        finance_option:
          $("#form-finance")?.value || "",
      });

      const formStatus = $("#form-status");

      if (formStatus) {
        formStatus.textContent =
          "Formulario listo. Falta conectar el destino definido por CORCAM.";
      }
    },
  );

  /* ========================================================
     ENLACES DE WHATSAPP
     ======================================================== */

  $$(".whatsapp-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      track("contact_whatsapp", {
        location: link.dataset.location || "",
      });

      const formStatus = $("#form-status");

      if (formStatus) {
        formStatus.textContent =
          "Falta incorporar el número definitivo de WhatsApp.";
      }

      $("#contacto")?.scrollIntoView({
        behavior: "smooth",
      });
    });
  });
})();
