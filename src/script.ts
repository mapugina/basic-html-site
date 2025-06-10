import './components/CarouselNav';
import './components/CarouselControls';
import './components/CarouselSlide';
import './components/MainCarousel';

import image1 from './images/1.png';
import image2 from './images/2.png';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';

// Update carousel slides with imported image paths
document.querySelectorAll('carousel-slide').forEach((slide, index) => {
    const imagePath = [image1, image2, image3, image4][index];
    if (imagePath) {
        slide.setAttribute('src', imagePath);
    }
});