document.addEventListener('DOMContentLoaded', () => {
    // This function loads an HTML file into a placeholder element on the page.
    const loadComponent = (url, placeholderId) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(placeholderId).innerHTML = data;
                // After loading, we need to make sure the interactive parts work.
                if (placeholderId === 'navbar-placeholder') {
                    initializeNavbar();
                }
            });
    };

    // Load the navbar and footer into their placeholders.
    loadComponent('navbar.html', 'navbar');
    loadComponent('footer.html', 'footer');

    // This function makes the navbar interactive after it's loaded.
    function initializeNavbar() {
        const body = document.body;
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const openIcon = document.getElementById('menu-open-icon');
        const closeIcon = document.getElementById('menu-close-icon');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                openIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
                body.classList.toggle('overflow-hidden');
            });
        }

        const navContainer = document.getElementById('nav-container');
        if (navContainer) {
            const navIndicator = document.getElementById('nav-indicator');
            const navLinks = navContainer.querySelectorAll('a.nav-link');
            const activeLink = Array.from(navLinks).find(link => new URL(link.href).pathname === window.location.pathname);

            function moveIndicator(element) {
                if (element && navIndicator) {
                    navIndicator.style.width = `${element.offsetWidth}px`;
                    navIndicator.style.left = `${element.offsetLeft}px`;
                }
            }

            if (activeLink) {
                setTimeout(() => {
                    moveIndicator(activeLink);
                    activeLink.classList.add('text-accent', 'font-medium');
                    activeLink.classList.remove('text-text-secondary');
                }, 150);
            }

            navLinks.forEach(link => {
                link.addEventListener('mouseenter', () => moveIndicator(link));
            });

            navContainer.addEventListener('mouseleave', () => {
                if (activeLink) {
                    moveIndicator(activeLink);
                } else if (navIndicator) {
                    navIndicator.style.width = '0px';
                }
            });
        }
    }
});