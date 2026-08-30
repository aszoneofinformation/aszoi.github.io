/* =========================================================
   ASZOI
   COMMUNICATION & MEDIA INTERFACE

   JavaScript
   Institutional / Restrained / Accessible
   ========================================================= */


/* =========================================================
   01 — DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /*
   * All behaviour is initialized from one place.
   * This keeps the script predictable and easy to maintain.
   */

  initMobileNavigation();
  initHeader();
  initRevealAnimations();
  initActiveNavigation();
  initSmoothAnchors();
  initFooterYear();

});


/* =========================================================
   02 — MOBILE NAVIGATION
   ========================================================= */

function initMobileNavigation() {

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!menuToggle || !navLinks) {
    return;
  }


  /*
   * Open / close menu
   */

  menuToggle.addEventListener("click", () => {

    const isOpen =
      navLinks.classList.toggle("open");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );

  });


  /*
   * Close menu when a navigation item is selected
   */

  navLinks.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      navLinks.classList.remove("open");

      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      document.body.classList.remove(
        "menu-open"
      );

    });

  });


  /*
   * Close menu with Escape
   */

  document.addEventListener("keydown", event => {

    if (event.key !== "Escape") {
      return;
    }

    if (!navLinks.classList.contains("open")) {
      return;
    }

    navLinks.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    document.body.classList.remove(
      "menu-open"
    );

    menuToggle.focus();

  });


  /*
   * If viewport becomes desktop-sized,
   * reset mobile menu state.
   */

  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 760) {

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );

      }

    }
  );

}


/* =========================================================
   03 — HEADER BEHAVIOUR
   ========================================================= */

function initHeader() {

  const header =
    document.querySelector(".site-header");

  if (!header) {
    return;
  }


  /*
   * The header becomes slightly more compact
   * after the visitor starts scrolling.
   *
   * CSS controls the actual visual change.
   * JS only adds / removes the state class.
   */

  let ticking = false;


  function updateHeader() {

    if (window.scrollY > 24) {

      header.classList.add("is-scrolled");

    } else {

      header.classList.remove("is-scrolled");

    }

    ticking = false;

  }


  window.addEventListener(
    "scroll",
    () => {

      if (!ticking) {

        window.requestAnimationFrame(
          updateHeader
        );

        ticking = true;

      }

    },
    { passive: true }
  );


  updateHeader();

}


/* =========================================================
   04 — REVEAL ANIMATIONS
   ========================================================= */

function initRevealAnimations() {

  const revealItems =
    document.querySelectorAll(".reveal");


  if (!revealItems.length) {
    return;
  }


  /*
   * Respect reduced-motion preferences.
   *
   * If the visitor has requested reduced motion,
   * everything becomes immediately visible.
   */

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    revealItems.forEach(item => {

      item.classList.add("is-visible");

    });

    return;

  }


  /*
   * IntersectionObserver keeps the page lightweight.
   */

  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          entry.target.classList.add(
            "is-visible"
          );


          /*
           * Each element only reveals once.
           */

          revealObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12,

        rootMargin:
          "0px 0px -5% 0px"
      }
    );


  revealItems.forEach(item => {

    revealObserver.observe(item);

  });

}


/* =========================================================
   05 — ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

  const sections = [
    ...document.querySelectorAll(
      "main section[id]"
    )
  ];


  const navItems = [
    ...document.querySelectorAll(
      ".nav-link"
    )
  ];


  if (!sections.length || !navItems.length) {
    return;
  }


  /*
   * Map navigation links to their section IDs.
   */

  const navMap = new Map();


  navItems.forEach(item => {

    const href =
      item.getAttribute("href");


    if (!href || !href.startsWith("#")) {
      return;
    }


    const id =
      href.substring(1);


    navMap.set(id, item);

  });


  /*
   * Special handling for sections that are
   * intentionally not present in the navigation.
   *
   * Purpose and ecosystem remain part of the page
   * but do not become primary navigation items.
   */

  const observer =
    new IntersectionObserver(
      entries => {

        const visibleSections =
          entries
            .filter(entry =>
              entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );


        if (!visibleSections.length) {
          return;
        }


        const currentSection =
          visibleSections[0].target;


        let activeId =
          currentSection.id;


        /*
         * Map internal structural sections
         * to the closest primary navigation area.
         */

        if (
          activeId === "purpose" ||
          activeId === "ecosystem"
        ) {

          const sectionTop =
            currentSection.getBoundingClientRect().top;

          /*
           * Determine which major area the visitor
           * is naturally moving through.
           */

          if (activeId === "purpose") {

            activeId = "about";

          }

          if (activeId === "ecosystem") {

            activeId = "work";

          }

        }


        navItems.forEach(item => {

          item.classList.toggle(
            "active",
            item.getAttribute("href") ===
              `#${activeId}`
          );

        });

      },
      {
        rootMargin:
          "-35% 0px -55% 0px",

        threshold: [
          0,
          0.1,
          0.25,
          0.5
        ]
      }
    );


  sections.forEach(section => {

    observer.observe(section);

  });

}


/* =========================================================
   06 — SMOOTH ANCHOR NAVIGATION
   ========================================================= */

function initSmoothAnchors() {

  const links =
    document.querySelectorAll(
      'a[href^="#"]'
    );


  if (!links.length) {
    return;
  }


  links.forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const href =
          link.getAttribute("href");


        /*
         * Ignore empty "#" links.
         */

        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(href);


        if (!target) {
          return;
        }


        event.preventDefault();


        const header =
          document.querySelector(
            ".site-header"
          );


        const headerHeight =
          header
            ? header.offsetHeight
            : 0;


        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;


        const reduceMotion =
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;


        window.scrollTo({

          top:
            Math.max(
              0,
              targetPosition
            ),

          behavior:
            reduceMotion
              ? "auto"
              : "smooth"

        });


        /*
         * Keep URL state useful without
         * creating a browser-history entry.
         */

        if (
          window.history &&
          window.history.replaceState
        ) {

          window.history.replaceState(
            null,
            "",
            href
          );

        }

      }
    );

  });

}


/* =========================================================
   07 — FOOTER YEAR
   ========================================================= */

function initFooterYear() {

  const year =
    document.getElementById("year");


  if (!year) {
    return;
  }


  year.textContent =
    new Date().getFullYear();

}


/* =========================================================
   08 — INITIAL PAGE STATE
   ========================================================= */

/*
 * If the visitor loads the page with a hash,
 * wait for the layout to settle before positioning
 * the requested section beneath the sticky header.
 */

window.addEventListener(
  "load",
  () => {

    if (!window.location.hash) {
      return;
    }


    const target =
      document.querySelector(
        window.location.hash
      );


    if (!target) {
      return;
    }


    const header =
      document.querySelector(
        ".site-header"
      );


    const headerHeight =
      header
        ? header.offsetHeight
        : 0;


    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    setTimeout(() => {

      window.scrollTo({

        top:
          Math.max(
            0,
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight
          ),

        behavior:
          reduceMotion
            ? "auto"
            : "smooth"

      });

    }, 50);

  }
);


/* =========================================================
   09 — VISIBILITY FALLBACK
   ========================================================= */

/*
 * Very old browsers without IntersectionObserver
 * should still receive the content.
 */

if (
  !("IntersectionObserver" in window)
) {

  document
    .querySelectorAll(".reveal")
    .forEach(item => {

      item.classList.add(
        "is-visible"
      );

    });

}
