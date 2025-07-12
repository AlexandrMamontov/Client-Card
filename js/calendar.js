document.addEventListener("DOMContentLoaded", function () {
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

    if (
      !calendarWrappers.length ||
      !calendarPreviousBtn ||
      !calendarNextBtn ||
      !calendarForm ||
      !dateInput ||
      !dateBtn
    ) {
      return;
    }

    // Текущая дата
    const currentDate = new Date();
    // Сбрасываем часы, минуты, секунды и миллисекунды для точного сравнения дат
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
      display.textContent = new Date(
        adjustedYear,
        adjustedMonth
      ).toLocaleDateString("ru-RU", {
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
        date.setHours(0, 0, 0, 0); // Сбрасываем время для точного сравнения
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

      // Отключаем только прошедшие даты (но не текущую)
      if (date < today) {
        div.classList.add("disabled");
      }

      // Выделение выбранной даты
      if (selectedDate && date.getTime() === selectedDate.getTime()) {
        div.classList.add("selected-date", "active");
      }

      // Обработчик клика
      if (!div.classList.contains("disabled")) {
        div.addEventListener("click", () => selectDate(date));
      }

      return div;
    }

    // Выбор даты
    function selectDate(date) {
      selectedDate = date;
      updateCalendar();
      updateDateInput();
    }

    // Обновление скрытого поля с датой
    function updateDateInput() {
      if (!selectedDate || !dateInput || !dateBtn) {
        if (dateInput) dateInput.value = "";
        return;
      }

      dateInput.value = formatDate(selectedDate);
      dateBtn.textContent = dateInput.value;
      calendarForm.classList.remove("active");
    }

    if (dateBtn) {
      dateBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        calendarForm.classList.toggle("active");
      });
    }

    document.addEventListener("click", function (e) {
      if (!e.target.closest("#date-btn, .whatsapp__calendar") && calendarForm) {
        calendarForm.classList.remove("active");
      }
    });

    // Форматирование даты
    function formatDate(date) {
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
      // Навигация по месяцам
      if (calendarPreviousBtn) {
        calendarPreviousBtn.addEventListener("click", (e) => {
          e.preventDefault();
          currentMonth--;
          if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
          }
          updateCalendar();
        });
      }

      if (calendarNextBtn) {
        calendarNextBtn.addEventListener("click", (e) => {
          e.preventDefault();
          currentMonth++;
          if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
          }
          updateCalendar();
        });
      }

      // Предотвращение закрытия при клике внутри календаря
      if (calendarForm) {
        calendarForm.addEventListener("click", (e) => {
          e.stopPropagation();
        });
      }
    }

    // Инициализация
    updateCalendar();
    setupEventListeners();
  }

  // Запуск календаря
  initCalendar();
});
