window.addEventListener("load", function() {
    document.querySelector('#title').innerHTML = "Image Carousel";
    document.querySelector('#timestamp').innerHTML = (new Date()).toString();

    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel__slide');
    const prevButton = document.querySelector('.carousel__button--prev');
    const nextButton = document.querySelector('.carousel__button--next');
    const navButtons = document.querySelectorAll('.carousel__nav-button');
    let currentSlide = 0;

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

    prevButton.addEventListener('click', () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener('click', () => {
        goToSlide((currentSlide + 1) % slides.length);
    });

    navButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const slideIndex = parseInt(button.dataset.slide);
            goToSlide(slideIndex);
        });
    });

    // Set initial active state
    goToSlide(0);
});