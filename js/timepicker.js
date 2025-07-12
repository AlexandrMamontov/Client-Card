document.addEventListener('DOMContentLoaded', function() {
    new Swiper('.hours.swiper-container', {
      direction: 'vertical',
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      loopAdditionalSlides: 10,
      resistanceRatio: 0,
      slideToClickedSlide: true,
    });

    new Swiper('.minutes.swiper-container', {
      direction: 'vertical',
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      loopAdditionalSlides: 10,
      resistanceRatio: 0,
      slideToClickedSlide: true,
    });
});