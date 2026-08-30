/* =========================================================
   ASZOI
   COMMUNICATION & MEDIA INTERFACE

   Homepage JavaScript
   Purpose:
   - Mobile navigation behaviour
   - Active navigation state
   - Smooth section navigation
   - Header behaviour
   - Accessibility
   - Lightweight reveal effects
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     01 — ELEMENTS
     ======================================================= */

  const header = document.querySelector(".site-header");
  const navigation = document.querySelector(".main-navigation");
  const navLinks = document.querySelectorAll(".nav-link");

  const sections = document.querySelectorAll(
    "main section[id], main .hero[id]"
  );


  /* =======================================================
     02 — SMOOTH NAVIGATION
     ======================================================= */

  navLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      /*
       * Keep the URL clean while still updating
       * the browser history.
       */
      history.pushState(
        null,
        "",
        targetId
      );

    });

  });


  /* =======================================================
     03 — ACTIVE NAVIGATION
     Highlights the section currently being viewed.
     ======================================================= */

  if ("IntersectionObserver" in window) {

    const sectionObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            const currentId =
              entry.target.getAttribute("id");

            if (!currentId) {
              return;
            }

            navLinks.forEach((link) => {

              const linkTarget =
                link.getAttribute("href");

              link.classList.toggle(
                "active",
                linkTarget === `#${currentId}`
              );

            });

          });

        },
        {
          rootMargin:
            "-25% 0px -65% 0px",

          threshold: 0
        }
      );


    sections.forEach((section) => {
      sectionObserver.observe(section);
    });

  }


  /* =======================================================
     04 — HEADER SCROLL STATE
     ======================================================= */

  if (header) {

    let lastScrollY = window.scrollY;

    const updateHeader =
      () => {

        const currentScrollY =
          window.scrollY;

        /*
         * Very subtle state change.
         * No dramatic disappearing header.
         */

        if (currentScrollY > 12) {
          header.classList.add(
            "is-scrolled"
          );
        } else {
          header.classList.remove(
            "is-scrolled"
          );
        }

        lastScrollY =
          currentScrollY;

      };


    window.addEventListener(
      "scroll",
      updateHeader,
      {
        passive: true
      }
    );

    updateHeader();

  }


  /* =======================================================
     05 — MOBILE NAVIGATION
     ======================================================= */

  /*
   * The mobile navigation is intentionally horizontal
   * and left aligned.
   *
   * This allows all institutional sections to remain
   * immediately accessible without introducing a
   * hamburger-menu/app-like interface.
   */

  if (navigation) {

    navigation.addEventListener(
      "wheel",
      (event) => {

        if (
          window.innerWidth <= 760 &&
          Math.abs(event.deltaY) >
          Math.abs(event.deltaX)
        ) {

          navigation.scrollLeft +=
            event.deltaY;

        }

      },
      {
        passive: true
      }
    );

  }


  /* =======================================================
     06 — KEYBOARD ACCESS
     ======================================================= */

  navLinks.forEach((link) => {

    link.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          link.click();

        }

      }
    );

  });


  /* =======================================================
     07 — LIGHT CONTENT REVEAL
     ======================================================= */

  /*
   * Extremely restrained.
   *
   * ASZOI should feel like an institution,
   * not an animated technology product.
   */

  const revealElements =
    document.querySelectorAll(
      ".work-row, " +
      ".publication-list a, " +
      ".participation-list a, " +
      ".connect-entry"
    );


  if (
    "IntersectionObserver" in window &&
    revealElements.length
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.08
        }
      );


    revealElements.forEach((element) => {

      element.classList.add(
        "reveal-item"
      );

      revealObserver.observe(
        element
      );

    });

  }


  /* =======================================================
     08 — EXTERNAL LINKS
     ======================================================= */

  const externalLinks =
    document.querySelectorAll(
      'a[href^="http"]'
    );


  externalLinks.forEach((link) => {

    /*
     * Only apply to links leaving ASZOI.
     */

    try {

      const url =
        new URL(
          link.href,
          window.location.href
        );

      if (
        url.hostname !==
        window.location.hostname
      ) {

        link.setAttribute(
          "target",
          "_blank"
        );

        link.setAttribute(
          "rel",
          "noopener noreferrer"
        );

      }

    } catch (error) {

      /*
       * Invalid URLs are left untouched.
       */

    }

  });


  /* =======================================================
     09 — CURRENT YEAR
     ======================================================= */

  const yearElements =
    document.querySelectorAll(
      "[data-current-year]"
    );


  yearElements.forEach((element) => {

    element.textContent =
      new Date().getFullYear();

  });


  /* =======================================================
     10 — PAGE READY
     ======================================================= */

  document.documentElement.classList.add(
    "js-ready"
  );

});
