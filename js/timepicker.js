document.addEventListener('DOMContentLoaded', function() {
  const timeBlock = document.querySelector('.whatsapp__date-block.time');
  if (!timeBlock) return;

  function createTimepicker() {
    timeBlock.innerHTML = '';

    const timepicker = document.createElement('div');
    timepicker.className = 'whatsapp__timepicker timepicker';

    // Hours slider
    const hoursContainer = document.createElement('div');
    hoursContainer.className = 'timepicker__container hours swiper-container';
    const hoursWrapper = document.createElement('div');
    hoursWrapper.className = 'swiper-wrapper';

    for (let i = 0; i < 24; i++) {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.textContent = i.toString().padStart(2, '0');
      hoursWrapper.appendChild(slide);
    }
    hoursContainer.appendChild(hoursWrapper);
    timepicker.appendChild(hoursContainer);

    // Minutes slider
    const minutesContainer = document.createElement('div');
    minutesContainer.className = 'timepicker__container minutes swiper-container';
    const minutesWrapper = document.createElement('div');
    minutesWrapper.className = 'swiper-wrapper';

    for (let i = 0; i < 60; i++) {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.textContent = i.toString().padStart(2, '0');
      minutesWrapper.appendChild(slide);
    }
    minutesContainer.appendChild(minutesWrapper);
    timepicker.appendChild(minutesContainer);

    // Button and input
    const timeBtn = document.createElement('button');
    timeBtn.id = 'time-btn';
    timeBtn.textContent = 'Время';

    const timeInput = document.createElement('input');
    timeInput.type = 'hidden';
    timeInput.id = 'time-input';
    timeInput.value = '';

    timeBlock.appendChild(timepicker);
    timeBlock.appendChild(timeBtn);
    timeBlock.appendChild(timeInput);

    initTimepicker(timepicker, timeBtn, timeInput);
  }

  function initTimepicker(timepicker, timeBtn, timeInput) {
    const now = new Date();
    let currentHours = now.getHours();
    let currentMinutes = now.getMinutes();
    
    // Сначала инициализируем слайдеры
    const hoursSlider = new Swiper('.hours.swiper-container', {
      direction: 'vertical',
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      loopAdditionalSlides: 10,
      initialSlide: currentHours,
      resistanceRatio: 0,
      slideToClickedSlide: true
    });

    const minutesSlider = new Swiper('.minutes.swiper-container', {
      direction: 'vertical',
      slidesPerView: 3,
      centeredSlides: true,
      loop: true,
      loopAdditionalSlides: 10,
      initialSlide: currentMinutes,
      resistanceRatio: 0,
      slideToClickedSlide: true
    });

    // Затем создаем функцию обновления времени
    const updateTime = () => {
      const hours = hoursSlider.realIndex;
      const minutes = minutesSlider.realIndex;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      timeInput.value = timeString;
      timeBtn.textContent = timeString;

      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);
      
      if (selectedTime < now) {
        timeBtn.classList.add('disabled');
        timeInput.setAttribute('disabled', 'true');
      } else {
        timeBtn.classList.remove('disabled');
        timeInput.removeAttribute('disabled');
      }
    };

    // Добавляем обработчики после создания функции
    hoursSlider.on('init', updateTime);
    hoursSlider.on('slideChange', updateTime);
    minutesSlider.on('init', updateTime);
    minutesSlider.on('slideChange', updateTime);

    // Инициализируем обновление времени
    hoursSlider.init();
    minutesSlider.init();

    timeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      timepicker.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('#time-btn, .timepicker')) {
        timepicker.classList.remove('active');
      }
    });

    function preventPastTime() {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      hoursSlider.on('slideChange', function() {
        if (hoursSlider.realIndex < currentHour) {
          hoursSlider.slideToLoop(currentHour);
        }
      });
      
      minutesSlider.on('slideChange', function() {
        if (hoursSlider.realIndex === currentHour && minutesSlider.realIndex < currentMinute) {
          minutesSlider.slideToLoop(currentMinute);
        }
      });
    }

    preventPastTime();
  }

  createTimepicker();
});