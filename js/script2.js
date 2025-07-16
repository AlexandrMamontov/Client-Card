document.addEventListener('DOMContentLoaded', function () {
    // переключение между вкладками
    let tabsBtn = document.querySelectorAll(".header__tab");
    let tabsBlocks = document.querySelectorAll(".main__wrapper");

    if (tabsBtn.length === 0 || tabsBlocks.length === 0) return;

    tabsBtn.forEach(function (element) {
        element.addEventListener("click", function (e) {
            const path = e.currentTarget.dataset.btn;
            tabsBtn.forEach(function (btn) {
                btn.classList.remove("active");
            });
            e.currentTarget.classList.add("active");
            tabsBlocks.forEach(function (element) {
                element.classList.remove("active");
            });

            const contentBlock = document.querySelector(`[data-content="${path}"]`);
            if (contentBlock) {
                contentBlock.classList.add("active");
            }
        });
    });


    // таймпикер
    const timeBlock = document.querySelector('.whatsapp__date-block.time');
    if (!timeBlock) return;

    // функция создания таймпикера
    function createTimepicker() {
        const timeBtn = document.querySelector('#time-btn');
        const timeInput = document.querySelector('#time-input');

        const timepicker = document.createElement('div');
        timepicker.className = 'whatsapp__timepicker timepicker';

        const timepickerWrapper = document.createElement('div');
        timepickerWrapper.className = 'timepicker__wrapper';

        // слайдер часов
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
        timepickerWrapper.appendChild(hoursContainer);

        // слайдер минут
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
        timepickerWrapper.appendChild(minutesContainer);
        timepicker.appendChild(timepickerWrapper);
        timeBlock.appendChild(timepicker);

        initTimepicker(timepicker, timeBtn, timeInput);
    }

    // функция инициализации таймпикера
    function initTimepicker(timepicker, timeBtn, timeInput) {
        const now = new Date();
        let currentHours = now.getHours();
        let currentMinutes = now.getMinutes();

        // инициализация слайдеров часов и минут
        const hoursSlider = new Swiper('.hours.swiper-container', {
            direction: 'vertical',
            slidesPerView: 3,
            centeredSlides: true,
            loop: true,
            loopAdditionalSlides: 10,
            initialSlide: currentHours,
            resistanceRatio: 0,
            slideToClickedSlide: true,
            grabCursor: true,
        });

        const minutesSlider = new Swiper('.minutes.swiper-container', {
            direction: 'vertical',
            slidesPerView: 3,
            centeredSlides: true,
            loop: true,
            loopAdditionalSlides: 10,
            initialSlide: currentMinutes,
            resistanceRatio: 0,
            slideToClickedSlide: true,
            grabCursor: true,
        });

        // функция обновления времени
        const updateTime = () => {
            const hours = hoursSlider.realIndex;
            const minutes = minutesSlider.realIndex;
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            timeInput.value = timeString;
            timeBtn.textContent = timeString;
        };

        // обработчики обновления времени
        hoursSlider.on('init', updateTime);
        hoursSlider.on('slideChange', updateTime);
        minutesSlider.on('init', updateTime);
        minutesSlider.on('slideChange', updateTime);

        // инициализация обновления времени
        hoursSlider.init();
        minutesSlider.init();

        // обработка клика по кнопке открытия таймпикера
        timeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            timepicker.classList.toggle('active');
            document.querySelector('.whatsapp__calendar').classList.remove('active');
        });

        // обработка кликов для таймпикера
        document.addEventListener('click', function (e) {
            if (!e.target.closest('#time-btn, .timepicker')) {
                timepicker.classList.remove('active');
            }
        });

        // function preventPastTime() {
        //     const now = new Date();
        //     const currentHour = now.getHours();
        //     const currentMinute = now.getMinutes();

        //     hoursSlider.on('slideChange', function () {
        //         if (hoursSlider.realIndex < currentHour) {
        //             hoursSlider.slideToLoop(currentHour);
        //         }
        //     });

        //     minutesSlider.on('slideChange', function () {
        //         if (hoursSlider.realIndex === currentHour && minutesSlider.realIndex < currentMinute) {
        //             minutesSlider.slideToLoop(currentMinute);
        //         }
        //     });
        // }

        // preventPastTime();
    }

    // вывод таймпикера на сайт
    createTimepicker();


    // календарь
    const dateBlock = document.querySelector('.whatsapp__date-block.date');
    if (!dateBlock) return;

    // функция создания календаря
    function createCalendar() {
        const dateBtn = document.querySelector('#date-btn');
        const dateInput = document.querySelector('#date-input');

        const calendar = document.createElement('div');
        calendar.className = 'whatsapp__calendar calendar';

        // кнопки переключения месяцев
        const calendarBtnLeft = document.createElement('button');
        const calendarBtnRight = document.createElement('button');
        calendarBtnLeft.className = 'calendar__btn left';
        calendarBtnRight.className = 'calendar__btn right';

        // блок с днями неделями
        const calendarBlock = document.createElement('div');
        const calendarWrapper = document.createElement('div');
        const calendarDisplay = document.createElement('div');
        const calendarDays = document.createElement('div');
        const calendarWeek = document.createElement('div');
        const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

        calendarBlock.className = 'calendar__block';
        calendarWrapper.className = 'calendar__wrapper';
        calendarDisplay.className = 'calendar__display';
        calendarDays.className = 'calendar__days';
        calendarWeek.className = 'calendar__week';

        // создаём дни недели
        weekDays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            calendarWeek.appendChild(dayElement);
        });

        calendarWrapper.append(calendarDisplay, calendarWeek, calendarDays);
        calendarBlock.appendChild(calendarWrapper);
        calendar.append(calendarBtnLeft, calendarBtnRight, calendarBlock);
        dateBlock.appendChild(calendar);

        initCalendar(calendar, calendarBtnLeft, calendarBtnRight, dateBtn, dateInput);
    }

    // функция инициализации календаря
    function initCalendar(calendar, calendarBtnLeft, calendarBtnRight, dateBtn, dateInput) {
        const calendarWrappers = calendar.querySelectorAll('.calendar__wrapper');

        // текущая дата
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        // выбранная дата
        let selectedDate = null;

        // функция обновления отображения календаря
        function updateCalendar() {
            calendarWrappers.forEach((wrapper, index) => {
                renderMonth(wrapper, index);
            });
        }

        // функция отрисовки месяца
        // monthOffdet нужен для кол-ва отображаемых месяцев
        // если нужно отобразить 2 месяца, то monthOffset = 1, а также продублировать calendarWrapper с индексами дней "_2"
        function renderMonth(wrapper, monthOffset = 0) {
            const month = currentMonth + monthOffset;
            const year = currentYear;
            const display = wrapper.querySelector(".calendar__display");
            const daysContainer = wrapper.querySelector(".calendar__days");

            // корректировка года при переходе через месяцы
            const adjustedYear = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
            const adjustedMonth = ((month % 12) + 12) % 12;

            // заголовок месяца
            display.textContent = new Date(adjustedYear, adjustedMonth).toLocaleDateString("ru-RU", {
                month: "long",
                year: "numeric",
            });

            // очистка и создание дней
            daysContainer.innerHTML = "";
            createMonthDays(daysContainer, adjustedYear, adjustedMonth);
        }

        // функция создания дней месяца
        function createMonthDays(container, year, month) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDayOfWeek = firstDay.getDay() || 7; // 1-7 (пн-вс)
            const daysInMonth = lastDay.getDate();

            // пустые ячейки для начала месяца
            for (let i = 1; i < startDayOfWeek; i++) {
                container.appendChild(createDayElement(null));
            }

            // дни месяца
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                date.setHours(0, 0, 0, 0);
                container.appendChild(createDayElement(date));
            }
        }

        // функция создания элемента дня
        function createDayElement(date) {
            const div = document.createElement("div");

            if (!date) {
                div.className = "empty-day";
                return div;
            }

            div.textContent = date.getDate();
            div.dataset.date = date.toISOString();

            // классы для разных состояний
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // текущий день
            if (date.getTime() === today.getTime()) {
                div.classList.add("current-date");
            }

            // отключаем только прошедшие даты
            if (date < today) {
                div.classList.add("disabled");
            }

            // выделение выбранной даты
            if (selectedDate && date.getTime() === selectedDate.getTime()) {
                div.classList.add("selected-date", "active");
            }

            // обработчик клика по дате
            if (!div.classList.contains("disabled")) {
                div.addEventListener("click", function () {
                    selectedDate = date;
                    updateCalendar();
                    updateDateInput();
                });
            }

            return div;
        }

        // обновление скрытого поля с датой
        function updateDateInput() {
            if (!selectedDate) {
                dateInput.value = "";
                dateBtn.textContent = "Дата";
                return;
            }

            // форматируем дату в формат yyyy-mm-dd
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            
            dateInput.value = `${year}-${month}-${day}`;
            dateBtn.textContent = dateInput.value;
        }

        updateCalendar();

        // обработка клика по кнопке открытия календаря
        dateBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            calendar.classList.toggle('active');
            document.querySelector('.whatsapp__timepicker').classList.remove('active');
        });

        // обработка кликов для календаря
        document.addEventListener('click', function (e) {
            if (!e.target.closest('#date-btn, .whatsapp__calendar')) {
                calendar.classList.remove('active');
            }
        });

        // смена месяца в обратную сторону
        calendarBtnLeft.addEventListener('click', function(e) {
            e.preventDefault();
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateCalendar();
        })

        // смена месяца вперёд
        calendarBtnRight.addEventListener("click", function (e) {
            e.preventDefault();
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateCalendar();
        });
    }

    // вывод календаря на сайт
    createCalendar();


    // чат должен быть проскроллен вниз по умолчанию
    const chat = document.querySelector(".whatsapp__chat");
    chat.scrollTop = chat.scrollHeight;

    
    // функция проверки на заполненные поля для отложеных сообщений
    function checkInputs(timeInput, dateInput, textInput, submitButton) {
        const isValid = timeInput && timeInput.value && dateInput && dateInput.value && textInput && textInput.value.trim();
        
        if (submitButton) {
            submitButton.disabled = !isValid;
            submitButton.style.opacity = isValid ? "1" : "0.5";
            submitButton.style.cursor = isValid ? "pointer" : "default";
        }
        
        return isValid;
    }

    // работа с формами отправки сообщений
    const blocks = document.querySelectorAll('.whatsapp__block');
    if (blocks.length) {
        blocks.forEach((block, index) => {
            const form = block.querySelector('.whatsapp__form');
            if (!form) return;
            
            const isDelayed = index === 1;
            const textArea = block.querySelector(".whatsapp__input-text");
            const submitButton = block.querySelector(".whatsapp__submit");
            const timeInput = isDelayed ? block.querySelector("#time-input") : null;
            const dateInput = isDelayed ? block.querySelector("#date-input") : null;

            // Предустановленные сообщения
            const btns = block.querySelectorAll(".whatsapp__btn");
            if (btns.length && textArea) {
                btns.forEach((btn) => {
                    btn.addEventListener("click", function (e) {
                        e.preventDefault();
                        const question = e.currentTarget.textContent.trim();
                        const currentText = textArea.value.split(" ").map((item) => item.trim());
                        if (!currentText.includes(question)) {
                            textArea.value += (textArea.value ? " " : "") + question;
                        }
                        if (isDelayed) {
                            checkInputs(timeInput, dateInput, textArea, submitButton);
                        }
                    });
                });
            }

            // Обработчики изменений для отложенных сообщений
            if (isDelayed) {
                timeInput?.addEventListener('change', () => {
                    checkInputs(timeInput, dateInput, textArea, submitButton);
                });
                dateInput?.addEventListener('change', () => {
                    checkInputs(timeInput, dateInput, textArea, submitButton);
                });
                textArea?.addEventListener('input', () => {
                    checkInputs(timeInput, dateInput, textArea, submitButton);
                });
                
                // Инициализация состояния кнопки
                checkInputs(timeInput, dateInput, textArea, submitButton);
            }

            form.addEventListener('submit', function(e) {
                e.preventDefault();

                if (!textArea) return;
                const messageText = textArea.value.trim();
                if (!messageText) return;
                
                if (isDelayed) {
                    if (!checkInputs(timeInput, dateInput, textArea, submitButton)) {
                        return;
                    }

                    const settingsBlock = block.querySelector(".whatsapp__settings");
                    if (!settingsBlock) return;

                    // Проверка даты/времени
                    const now = new Date();
                    const [year, month, day] = dateInput.value.split('-').map(Number);
                    const [hours, minutes] = timeInput.value.split(':').map(Number);
                    const selectedDateTime = new Date(year, month - 1, day, hours, minutes);

                    if (selectedDateTime <= now) {
                        let errorElement = settingsBlock.querySelector(".settings-error");
                        if (!errorElement) {
                            errorElement = document.createElement("span");
                            errorElement.className = "settings-error";
                            errorElement.textContent = "Ошибка! Выберите корректное время отправки отложенного сообщения.";
                            settingsBlock.appendChild(errorElement);
                        }
                        return;
                    } else {
                        const errorElement = settingsBlock.querySelector(".settings-error");
                        if (errorElement) {
                            errorElement.remove();
                        }
                    }

                    addMessageToChat(messageText, timeInput.value, dateInput.value, true);
                } else {
                    const now = new Date();
                    const currentDate = now.toISOString().slice(0, 10);
                    const currentTime = now.toTimeString().slice(0, 5);
                    addMessageToChat(messageText, currentTime, currentDate, false);
                }

                // Очистка формы
                textArea.value = "";
                if (isDelayed && timeInput && dateInput) {
                    timeInput.value = "";
                    dateInput.value = "";
                    
                    const dateBtn = block.querySelector("#date-btn");
                    const timeBtn = block.querySelector("#time-btn");
                    if (dateBtn) dateBtn.textContent = "Дата";
                    if (timeBtn) timeBtn.textContent = "Время";

                    const calendar = block.querySelector(".calendar");
                    const timepicker = block.querySelector(".timepicker");

                    // cброс состояния календаря
                    if (calendar) {
                        calendar.remove();
                        // переинициализация календаря
                        createCalendar();
                    }

                    // сброс состояния таймпикера
                    if (timepicker) {
                        timepicker.remove();
                        // переинициализация таймпикера
                        createTimepicker();
                    }

                    checkInputs(timeInput, dateInput, textArea, submitButton);
                }
            });

            function addMessageToChat(messageText, time, date, isDelayed) {
                if (!chat) return;

                const messageElement = document.createElement("div");
                messageElement.className = "whatsapp__manager";
                
                messageElement.innerHTML = `
                    <p class="whatsapp__text">${messageText}</p>
                    <div class="whatsapp__status">
                        <div class="whatsapp__date">${date} ${time}</div>
                        <div class="whatsapp__check">
                            ${isDelayed ? `
                                <span>
                                    Будет отправлено
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
                                        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                                    </svg>
                                </span>
                            ` : `
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155dfc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M18 6 7 17l-5-5"></path>
                                    <path d="m22 10-7.5 7.5L13 16"></path>
                                </svg>
                            `}
                        </div>
                    </div>
                `;

                chat.appendChild(messageElement);
                chat.scrollTop = chat.scrollHeight;
            }
        });
    }
})