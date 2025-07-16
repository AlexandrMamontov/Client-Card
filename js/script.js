document.addEventListener("DOMContentLoaded", function () {
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


    // предустановленные сообщения
    const blocks = document.querySelectorAll(".whatsapp__block");
    blocks.forEach((block) => {
        const btns = block.querySelectorAll(".whatsapp__btn");
        const textArea = block.querySelector(".whatsapp__input-text");
        if (btns.length > 0 && textArea) {
            btns.forEach((btn) => {
                btn.addEventListener("click", function (e) {
                    e.preventDefault();
                    const question = e.currentTarget.textContent.trim();
                    const currentText = textArea.value.split(" ").map((item) => item.trim());
                    if (!currentText.includes(question)) {
                        textArea.value += (textArea.value ? " " : "") + question;
                    }
                });
            });
        }
    });


    // чат должен быть проскроллен вниз по умолчанию
    const chat = document.querySelector(".whatsapp__chat");
    chat.scrollTop = chat.scrollHeight;


    // Функция создания календаря
    function createCalendar() {
        const dateBlock = document.querySelector(".whatsapp__date-block.date");
        if (!dateBlock) return;

        // Проверяем, не существует ли уже календарь
        if (dateBlock.querySelector(".whatsapp__calendar")) return;

        const calendarHTML = `
            <div class="whatsapp__calendar calendar">
                <button class="calendar__btn left"></button>
                <button class="calendar__btn right"></button>
                <div class="calendar__block">
                    <div class="calendar__wrapper">
                        <div class="calendar__display"></div>
                        <div class="calendar__week">
                            <div>Пн</div>
                            <div>Вт</div>
                            <div>Ср</div>
                            <div>Чт</div>
                            <div>Пт</div>
                            <div>Сб</div>
                            <div>Вс</div>
                        </div>
                        <div class="calendar__days"></div>
                    </div>
                </div>
            </div>
            <button id="date-btn">Дата</button>
            <input type="hidden" id="date-input" value="">
        `;

        dateBlock.innerHTML = calendarHTML;
    }

    // Инициализация календаря
    function initCalendar() {
        createCalendar();

        const calendarWrappers = document.querySelectorAll(".calendar__wrapper");
        const calendarPreviousBtn = document.querySelector(".calendar__btn.left");
        const calendarNextBtn = document.querySelector(".calendar__btn.right");
        const calendarForm = document.querySelector(".whatsapp__calendar");
        const dateInput = document.getElementById("date-input");
        const dateBtn = document.getElementById("date-btn");

        if (!calendarWrappers.length || !calendarPreviousBtn || !calendarNextBtn || !calendarForm || !dateInput || !dateBtn) {
            return;
        }

        // Текущая дата
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        // Выбранная дата
        let selectedDate = null;

        // Обновление отображения календаря
        function updateCalendar() {
            calendarWrappers.forEach((wrapper, index) => {
                renderMonth(wrapper, index);
            });
        }

        // Отрисовка месяца
        function renderMonth(wrapper, monthOffset = 0) {
            const month = currentMonth + monthOffset;
            const year = currentYear;
            const display = wrapper.querySelector(".calendar__display");
            const daysContainer = wrapper.querySelector(".calendar__days");

            if (!display || !daysContainer) return;

            // Корректировка года при переходе через месяцы
            const adjustedYear = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
            const adjustedMonth = ((month % 12) + 12) % 12;

            // Заголовок месяца
            display.textContent = new Date(adjustedYear, adjustedMonth).toLocaleDateString("ru-RU", {
                month: "long",
                year: "numeric",
            });

            // Очистка и создание дней
            daysContainer.innerHTML = "";
            createMonthDays(daysContainer, adjustedYear, adjustedMonth);
        }

        // Создание дней месяца
        function createMonthDays(container, year, month) {
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDayOfWeek = firstDay.getDay() || 7; // 1-7 (Пн-Вс)
            const daysInMonth = lastDay.getDate();

            // Пустые ячейки для начала месяца
            for (let i = 1; i < startDayOfWeek; i++) {
                container.appendChild(createDayElement(null));
            }

            // Дни месяца
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                date.setHours(0, 0, 0, 0);
                container.appendChild(createDayElement(date));
            }
        }

        // Создание элемента дня
        function createDayElement(date) {
            const div = document.createElement("div");

            if (!date) {
                div.className = "empty-day";
                return div;
            }

            div.textContent = date.getDate();
            div.dataset.date = date.toISOString();

            // Классы для разных состояний
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date.getTime() === today.getTime()) {
                div.classList.add("current-date");
            }

            // Отключаем только прошедшие даты
            if (date < today) {
                div.classList.add("disabled");
            }

            // Выделение выбранной даты
            if (selectedDate && date.getTime() === selectedDate.getTime()) {
                div.classList.add("selected-date", "active");
            }

            // Обработчик клика
            if (!div.classList.contains("disabled")) {
                div.addEventListener("click", function () {
                    selectedDate = date;
                    updateCalendar();
                    updateDateInput();
                });
            }

            return div;
        }

        // Обновление скрытого поля с датой
        function updateDateInput() {
            if (!selectedDate) {
                dateInput.value = "";
                return;
            }

            // Форматируем дату в формат YYYY-MM-DD
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            
            dateInput.value = `${year}-${month}-${day}`;
            dateBtn.textContent = dateInput.value;
            calendarForm.classList.remove("active");
        }

        // Обработчики событий
        function setupEventListeners() {
            // Навигация по месяцам
            calendarPreviousBtn.addEventListener("click", function (e) {
                e.preventDefault();
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                updateCalendar();
            });

            calendarNextBtn.addEventListener("click", function (e) {
                e.preventDefault();
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                updateCalendar();
            });

            // Открытие/закрытие календаря
            dateBtn.addEventListener("click", function (e) {
                e.stopPropagation();
                calendarForm.classList.toggle("active");
            });

            // Закрытие при клике вне календаря
            document.addEventListener("click", function (e) {
                if (!e.target.closest("#date-btn, .whatsapp__calendar")) {
                    calendarForm.classList.remove("active");
                }
            });

            // Предотвращение закрытия при клике внутри календаря
            calendarForm.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }

        // Инициализация
        updateCalendar();
        setupEventListeners();
    }

    // Запуск календаря
    initCalendar();



    const timeBlock = document.querySelector(".whatsapp__date-block.time");
    if (!timeBlock) return;

    function createTimepicker() {
        timeBlock.innerHTML = "";

        const timepicker = document.createElement("div");
        timepicker.className = "whatsapp__timepicker timepicker";

        // Hours slider
        const hoursContainer = document.createElement("div");
        hoursContainer.className = "timepicker__container hours swiper-container";
        const hoursWrapper = document.createElement("div");
        hoursWrapper.className = "swiper-wrapper";

        for (let i = 0; i < 24; i++) {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.textContent = i.toString().padStart(2, "0");
            hoursWrapper.appendChild(slide);
        }
        hoursContainer.appendChild(hoursWrapper);
        timepicker.appendChild(hoursContainer);

        // Minutes slider
        const minutesContainer = document.createElement("div");
        minutesContainer.className = "timepicker__container minutes swiper-container";
        const minutesWrapper = document.createElement("div");
        minutesWrapper.className = "swiper-wrapper";

        for (let i = 0; i < 60; i++) {
            const slide = document.createElement("div");
            slide.className = "swiper-slide";
            slide.textContent = i.toString().padStart(2, "0");
            minutesWrapper.appendChild(slide);
        }
        minutesContainer.appendChild(minutesWrapper);
        timepicker.appendChild(minutesContainer);

        // Button and input
        const timeBtn = document.createElement("button");
        timeBtn.id = "time-btn";
        timeBtn.textContent = "Время";

        const timeInput = document.createElement("input");
        timeInput.type = "hidden";
        timeInput.id = "time-input";
        timeInput.value = "";

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
        const hoursSlider = new Swiper(".hours.swiper-container", {
            direction: "vertical",
            slidesPerView: 3,
            centeredSlides: true,
            loop: true,
            loopAdditionalSlides: 10,
            initialSlide: currentHours,
            resistanceRatio: 0,
            slideToClickedSlide: true,
            grabCursor: true,
        });

        const minutesSlider = new Swiper(".minutes.swiper-container", {
            direction: "vertical",
            slidesPerView: 3,
            centeredSlides: true,
            loop: true,
            loopAdditionalSlides: 10,
            initialSlide: currentMinutes,
            resistanceRatio: 0,
            slideToClickedSlide: true,
            grabCursor: true,
        });

        // Затем создаем функцию обновления времени
        const updateTime = () => {
            const hours = hoursSlider.realIndex;
            const minutes = minutesSlider.realIndex;
            const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

            timeInput.value = timeString;
            timeBtn.textContent = timeString;

            const selectedTime = new Date();
            selectedTime.setHours(hours, minutes, 0, 0);
        };

        // Добавляем обработчики после создания функции
        hoursSlider.on("init", updateTime);
        hoursSlider.on("slideChange", updateTime);
        minutesSlider.on("init", updateTime);
        minutesSlider.on("slideChange", updateTime);

        // Инициализируем обновление времени
        hoursSlider.init();
        minutesSlider.init();

        timeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            timepicker.classList.toggle("active");
        });

        document.addEventListener("click", function (e) {
            if (!e.target.closest("#time-btn, .timepicker")) {
                timepicker.classList.remove("active");
            }
        });

        // function preventPastTime() {
        //     const now = new Date();
        //     const currentHour = now.getHours();
        //     const currentMinute = now.getMinutes();

        //     hoursSlider.on("slideChange", function () {
        //         if (hoursSlider.realIndex < currentHour) {
        //             hoursSlider.slideToLoop(currentHour);
        //         }
        //     });

        //     minutesSlider.on("slideChange", function () {
        //         if (hoursSlider.realIndex === currentHour && minutesSlider.realIndex < currentMinute) {
        //             minutesSlider.slideToLoop(currentMinute);
        //         }
        //     });
        // }

        // preventPastTime();
    }

    createTimepicker();


    // логика блокировки кнопки для отложенных сообщений
    const delayedBlock = document.querySelector(".whatsapp__block.delayed-block");
    if (delayedBlock) {
        const timeInput = delayedBlock.querySelector("#time-input");
        const dateInput = delayedBlock.querySelector("#date-input");
        const submitButton = delayedBlock.querySelector(".whatsapp__submit");

        if (timeInput && dateInput && submitButton) {
            // изначально кнопка заблокирована
            submitButton.disabled = true;
            submitButton.style.opacity = "0.5";
            submitButton.style.cursor = "not-allowed";

            function checkInputs() {
                if (timeInput.value && dateInput.value) {
                    submitButton.disabled = false;
                    submitButton.style.opacity = "1";
                    submitButton.style.cursor = "pointer";
                } else {
                    submitButton.disabled = true;
                    submitButton.style.opacity = "0.5";
                    submitButton.style.cursor = "not-allowed";
                }
            }

            // Создаем MutationObserver для отслеживания изменений value
            const observerConfig = { attributes: true, attributeFilter: ['value'] };
            
            const timeObserver = new MutationObserver(checkInputs);
            timeObserver.observe(timeInput, observerConfig);
            
            const dateObserver = new MutationObserver(checkInputs);
            dateObserver.observe(dateInput, observerConfig);

            // Также проверяем сразу при загрузке
            checkInputs();
        }
    }


    // обработка отправки сообщений
    const forms = document.querySelectorAll(".whatsapp__form");
    forms.forEach((form, index) => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const textInput = form.querySelector(".whatsapp__input-text");
            if (!textInput) return;

            const messageText = textInput.value.trim();
            if (!messageText) return;

            const isDelayed = index === 1; // вторая форма - отложенная

            if (isDelayed) {
                const timeInput = form.parentElement.querySelector("#time-input");
                const dateInput = form.parentElement.querySelector("#date-input");
                const settingsBlock = form.parentElement.querySelector(".whatsapp__settings");

                if (!timeInput || !dateInput || !timeInput.value || !dateInput.value) return;

                // Проверяем, что выбранная дата/время в будущем
                const now = new Date();
                const [year, month, day] = dateInput.value.split('-').map(Number);
                const [hours, minutes] = timeInput.value.split(':').map(Number);
                
                const selectedDateTime = new Date(year, month - 1, day, hours, minutes);
                
                if (selectedDateTime <= now) {
                    // Создаем или находим элемент для ошибки
                    let errorElement = settingsBlock.querySelector(".settings-error");
                    if (!errorElement) {
                        errorElement = document.createElement("span");
                        errorElement.className = "settings-error";
                        settingsBlock.appendChild(errorElement);
                    }
                    
                    errorElement.textContent = "Ошибка! Выберите корректное время отправки отложенного сообщения.";
                    return; // Прерываем отправку
                } else {
                    // Убираем сообщение об ошибке, если оно было
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

            // очистка формы
            textInput.value = "";
            if (isDelayed) {
                const timeInput = form.parentElement.querySelector("#time-input");
                const dateInput = form.parentElement.querySelector("#date-input");
                const submitButton = form.querySelector(".whatsapp__submit");
                const dateBtn = form.parentElement.querySelector("#date-btn");
                const timeBtn = form.parentElement.querySelector("#time-btn");
                const calendarForm = form.parentElement.querySelector(".whatsapp__calendar");
                const timepicker = form.parentElement.querySelector(".timepicker");

                if (timeInput && dateInput && submitButton && dateBtn && timeBtn) {
                    timeInput.value = "";
                    dateInput.value = "";
                    dateBtn.textContent = "Дата";
                    timeBtn.textContent = "Время";

                    // Сброс состояния календаря
                    if (calendarForm) {
                        // Переинициализация календаря
                        initCalendar();
                    }

                    // Сброс состояния таймпикера
                    if (timepicker) {
                        timepicker.classList.remove("active");
                        // Переинициализация таймпикера
                        createTimepicker();
                    }

                    // Блокировка кнопки
                    submitButton.disabled = true;
                    submitButton.style.opacity = "0.5";
                    submitButton.style.cursor = "not-allowed";
                }
            }
        });
    });


    // Функция добавления сообщения в чат
    function addMessageToChat(messageText, time, date, isDelayed) {
        const chat = document.querySelector(".whatsapp__chat");
        if (!chat) return;

        const messageElement = document.createElement("div");
        messageElement.className = "whatsapp__manager";

        const textElement = document.createElement("p");
        textElement.className = "whatsapp__text";
        textElement.textContent = messageText;

        const statusElement = document.createElement("div");
        statusElement.className = "whatsapp__status";

        const dateElement = document.createElement("div");
        dateElement.className = "whatsapp__date";
        dateElement.textContent = `${date} ${time}`;

        const checkElement = document.createElement("div");
        checkElement.className = "whatsapp__check";

        if (isDelayed) {
            checkElement.innerHTML = `
                <span>
                    Будет отправлено
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"></circle>
                        <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                </span>
            `;
        } else {
            checkElement.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155dfc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 7 17l-5-5"></path>
                    <path d="m22 10-7.5 7.5L13 16"></path>
                </svg>
            `;
        }

        statusElement.appendChild(dateElement);
        statusElement.appendChild(checkElement);

        messageElement.appendChild(textElement);
        messageElement.appendChild(statusElement);

        chat.appendChild(messageElement);

        // Прокрутка к последнему сообщению
        chat.scrollTop = chat.scrollHeight;
    }
});
