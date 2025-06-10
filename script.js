window.addEventListener("load", function() {
    document.querySelector('#title').innerHTML = "Image Carousel";
    document.querySelector('#timestamp').innerHTML = (new Date()).toString();

    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel__slide');
    const prevButton = document.querySelector('.carousel__button--prev');
    const nextButton = document.querySelector('.carousel__button--next');
    const navButtons = document.querySelectorAll('.carousel__nav-button');
    let currentSlide = 0;
    let autoRotateInterval;
    const rotationDelay = 10000; // Time between slides in milliseconds

    function goToSlide(index) {
        currentSlide = index;
        slides[currentSlide].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
        
        // Update active state of nav buttons
        navButtons.forEach((btn, idx) => {
            btn.classList.toggle('is-active', idx === currentSlide);
        });
    }

    function startAutoRotate() {
        stopAutoRotate(); // Clear any existing interval
        autoRotateInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, rotationDelay);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);

    // Manual navigation
    prevButton.addEventListener('click', () => {
        stopAutoRotate();
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
        startAutoRotate();
    });

    nextButton.addEventListener('click', () => {
        stopAutoRotate();
        goToSlide((currentSlide + 1) % slides.length);
        startAutoRotate();
    });

    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            stopAutoRotate();
            const slideIndex = parseInt(button.dataset.slide);
            goToSlide(slideIndex);
            startAutoRotate();
        });
    });

    // Start auto-rotation
    startAutoRotate();
    // Set initial active state
    goToSlide(0);
});