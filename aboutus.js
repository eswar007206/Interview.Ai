// Get DOM elements
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);

// Function to change slides instantly without delays
function showSlider(type) {
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]); // Move first slide to last
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]); // Move first thumbnail to last
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]); // Move last slide to first
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]); // Move last thumbnail to first
    }
}

// Attach event listeners to the arrow buttons
nextDom.addEventListener('click', function () {
    showSlider('next');
});

prevDom.addEventListener('click', function () {
    showSlider('prev');
});
