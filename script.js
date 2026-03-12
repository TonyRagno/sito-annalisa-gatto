// Init loaded state for entrance animations
window.addEventListener('load', () => {
    document.body.classList.add('is-loaded'); // Triggers intro animations
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);
});

// Custom Cursor (Desktop Only)
const cursor = document.getElementById('cursor');
if (window.innerWidth > 768 && cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    const hoverElements = document.querySelectorAll('a, button, .menu-toggle, .img-badge, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
}

// Fullscreen Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuLinks = document.querySelectorAll('.menu-link');

function toggleMenu() {
    menuToggle.classList.toggle('open');
    menuOverlay.classList.toggle('active');

    if (menuOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

menuToggle.addEventListener('click', toggleMenu);
menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

// Intersection Observer for Smooth Scroll Reveals
const revealElements = document.querySelectorAll('section, .reveal-img');

function checkReveal() {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            el.classList.add('in-view');
        }
    });
}

window.addEventListener('scroll', checkReveal);
checkReveal(); // Trigger on initial load

// Parallax Effect
const parallaxLayers = document.querySelectorAll('.parallax-layer');
window.addEventListener('scroll', () => {
    // Only perform parallax if not strictly mobile for performance & visual fidelity
    if (window.innerWidth > 768) {
        const scrolled = window.scrollY;
        parallaxLayers.forEach(layer => {
            const speed = layer.getAttribute('data-speed');
            const yPos = scrolled * speed;
            layer.style.transform = `translateY(${yPos}px)`;
        });
    }
});

// Dynamic Footer Year
document.getElementById('year').textContent = new Date().getFullYear();

// Web3Forms Submit
const form = document.getElementById('contactForm');
const result = document.getElementById('formResult');
const submitButton = document.getElementById('submitButton');
const btnText = document.querySelector('.btn-text');

if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        submitButton.disabled = true;
        btnText.textContent = 'Invio in corso...';

        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        result.textContent = "Attendere prego...";
        result.style.color = "rgba(255,255,255,0.6)";

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.style.color = "var(--accent-color)";
                    result.textContent = "Messaggio inviato. Ti risponderò presto.";
                    form.reset();
                } else {
                    result.style.color = "#FF4D4D";
                    result.textContent = json.message || "Errore. Riprova più tardi.";
                }
            })
            .catch(error => {
                result.style.color = "#FF4D4D";
                result.textContent = "Errore di connessione.";
                console.log(error);
            })
            .then(function () {
                submitButton.disabled = false;
                btnText.textContent = 'Invia il messaggio';
                setTimeout(() => {
                    result.textContent = "";
                }, 6000);
            });
    });
}

// Magnetic Button Effect (Desktop Only)
const magneticBtns = document.querySelectorAll('.magnetic-btn');
if (window.innerWidth > 768) {
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const position = btn.getBoundingClientRect();
            // Calculate distance from center
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            // Subtle pull
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.4}px)`;
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}
