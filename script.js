/* =========================================================
   ASZOI — HOMEPAGE INTERACTIONS
   Deliberate, restrained institutional interface.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       SMOOTH INTERNAL NAVIGATION
       ===================================================== */

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

            const header = document.querySelector(".site-header");

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                12;


            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"
            });

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    const currentId =
                        entry.target.getAttribute("id");

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
            observer.observe(section);
        });

    }


    /* =====================================================
       HERO STATE
       ===================================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        const updateHeroState = () => {

            const scrollPosition =
                window.scrollY;

            hero.classList.toggle(
                "is-scrolled",
                scrollPosition > 40
            );

        };

        window.addEventListener(
            "scroll",
            updateHeroState,
            {
                passive: true
            }
        );

        updateHeroState();

    }


    /* =====================================================
       SUBTLE CONTENT REVEAL
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-label, " +
        ".section-statement, " +
        ".section-copy, " +
        ".purpose-layout, " +
        ".work-row, " +
        ".ecosystem-unit, " +
        ".publication-list > div, " +
        ".participation-list > a, " +
        ".connect-heading"
    );


    if (
        !prefersReducedMotion &&
        "IntersectionObserver" in window
    ) {

        revealElements.forEach((element) => {
            element.classList.add("reveal-ready");
        });


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
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -45px 0px"
                }
            );


        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    }


    /* =====================================================
       FOOTER YEAR
       ===================================================== */

    const footerYear =
        document.querySelector(".footer-bottom span");

    if (footerYear) {

        const currentYear =
            new Date().getFullYear();

        footerYear.textContent =
            `© ${currentYear} ASZOI`;

    }


    /* =====================================================
       EXTERNAL / PLACEHOLDER LINKS
       ===================================================== */

    document.querySelectorAll(
        'a[href="#"]'
    ).forEach((link) => {

        link.addEventListener("click", (event) => {
            event.preventDefault();
        });

    });

});
