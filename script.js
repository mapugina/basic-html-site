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
        let progressValue = 0;
        let lastProgressUpdate = 0;

        function updateProgress() {
            const now = Date.now();
            if (lastProgressUpdate === 0) lastProgressUpdate = now;
            const delta = now - lastProgressUpdate;
            progressValue = progressValue + (delta / rotationDelay) * 100;
            
            if (progressValue >= 100) {
                goToSlide((currentSlide + 1) % slides.length);
                progressValue = 0;
            }
            
            progress.style.setProperty('--progress', progressValue);
            lastProgressUpdate = now;
        }

        function resetProgress() {
            progressValue = 0;
            lastProgressUpdate = Date.now();
            progress.style.setProperty('--progress', 0);
        }

        function startProgressAnimation() {
            if (autoRotateInterval) return;
            lastProgressUpdate = Date.now();
            autoRotateInterval = setInterval(() => {
                updateProgress();
            }, 100); // Update progress more frequently for smooth animation
        }

        function pauseProgress() {
            if (autoRotateInterval) {
                clearInterval(autoRotateInterval);
                autoRotateInterval = null;
                updateProgress(); // Capture final position
            }
        }

        function goToSlide(index) {
            currentSlide = index;
            slides[currentSlide].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            
            resetProgress();
            
            navButtons.forEach((btn, idx) => {
                btn.classList.toggle('is-active', idx === currentSlide);
            });
        }

        // Event Listeners
        carousel.addEventListener('mouseenter', () => {
            pauseProgress();
        });

        carousel.addEventListener('mouseleave', () => {
            startProgressAnimation();
        });

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            pauseProgress();
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToSlide((currentSlide + 1) % slides.length);
                } else {
                    goToSlide((currentSlide - 1 + slides.length) % slides.length);
                }
            }
            startProgressAnimation();
        }, { passive: true });

        prevButton.addEventListener('click', () => {
            pauseProgress();
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
            startProgressAnimation();
        });

        nextButton.addEventListener('click', () => {
            pauseProgress();
            goToSlide((currentSlide + 1) % slides.length);
            startProgressAnimation();
        });

        navButtons.forEach((button) => {
            button.addEventListener('click', () => {
                pauseProgress();
                const slideIndex = parseInt(button.dataset.slide);
                goToSlide(slideIndex);
                startProgressAnimation();
            });
        });

        // Update page content
        if (title) title.innerHTML = "Image Carousel";
        if (timestamp) timestamp.innerHTML = (new Date()).toString();

        // Initial setup
        resetProgress();
        startProgressAnimation();
        goToSlide(0);

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            pauseProgress();
        });

    } catch (error) {
        console.error('Carousel initialization failed:', error);
    }
});