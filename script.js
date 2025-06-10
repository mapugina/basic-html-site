window.addEventListener("DOMContentLoaded", function() {
    try {
        const carousel = document.querySelector('.carousel');
        const slides = document.querySelectorAll('.carousel__slide');
        const prevButton = document.querySelector('.carousel__button--prev');
        const nextButton = document.querySelector('.carousel__button--next');
        const navButtons = document.querySelectorAll('.carousel__nav-button');
        const title = document.querySelector('#title');
        const timestamp = document.querySelector('#timestamp');
        const progress = document.querySelector('.carousel__progress');

        if (!carousel || !slides.length || !prevButton || !nextButton || !navButtons.length) {
            throw new Error('Required carousel elements not found');
        }

        let currentSlide = 0;
        let autoRotateInterval;
        let touchStartX = 0;
        const rotationDelay = 5000;

        function resetProgress() {
            progress.style.animation = 'none';
            progress.offsetHeight; // Force reflow
            progress.style.animation = 'progress 5s linear';
        }

        function goToSlide(index) {
            currentSlide = index;
            slides[currentSlide].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            
            // Reset and restart progress animation
            resetProgress();
            
            navButtons.forEach((btn, idx) => {
                btn.classList.toggle('is-active', idx === currentSlide);
            });
        }

        function startAutoRotate() {
            stopAutoRotate();
            resetProgress();
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

        // Touch events
        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
            stopAutoRotate();
        }

        function handleTouchEnd(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    goToSlide((currentSlide + 1) % slides.length);
                } else {
                    goToSlide((currentSlide - 1 + slides.length) % slides.length);
                }
            }
            startAutoRotate();
        }

        // Event Listeners
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);
        carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
        carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

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

        // Update page content
        if (title) title.innerHTML = "Image Carousel";
        if (timestamp) timestamp.innerHTML = (new Date()).toString();

        // Initial setup
        startAutoRotate();
        goToSlide(0);

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            stopAutoRotate();
        });

    } catch (error) {
        console.error('Carousel initialization failed:', error);
    }
});