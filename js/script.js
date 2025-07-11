document.addEventListener("DOMContentLoaded", function () {
  // переключение между вкладками
  let tabsBtn = document.querySelectorAll(".header__tab");
  let tabsBlocks = document.querySelectorAll(".main__wrapper");

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

      document
        .querySelector(`[data-content="${path}"]`)
        .classList.add("active");
    });
  });

  // вкладка ватсап, отправление сообщений
  const blocks = document.querySelectorAll(".whatsapp__block");
  blocks.forEach((block) => {
    const btns = block.querySelectorAll(".whatsapp__btn");
    const textArea = block.querySelector(".whatsapp__input-text");
    if (btns && textArea) {
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

  // Логика блокировки кнопки для отложенных сообщений
  const delayedBlock = document.querySelector('.whatsapp__block.delayed-block');
  if (delayedBlock) {
    const timeInput = delayedBlock.querySelector('input[type="time"]');
    const dateInput = delayedBlock.querySelector('input[type="date"]');
    const submitButton = delayedBlock.querySelector('.whatsapp__submit');
    
    // Изначально кнопка заблокирована
    submitButton.disabled = true;
    submitButton.style.opacity = '0.5';
    submitButton.style.cursor = 'not-allowed';
    
    function checkInputs() {
      if (timeInput.value && dateInput.value) {
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
      } else {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.5';
        submitButton.style.cursor = 'not-allowed';
      }
    }
    
    timeInput.addEventListener('change', checkInputs);
    dateInput.addEventListener('change', checkInputs);
  }

  // Обработка отправки сообщений
  const forms = document.querySelectorAll('.whatsapp__form');
  forms.forEach((form, index) => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const textInput = form.querySelector('.whatsapp__input-text');
      const messageText = textInput.value.trim();
      
      if (!messageText) return;
      
      const isDelayed = index === 1; // Вторая форма - отложенная
      
      if (isDelayed) {
        const timeInput = form.parentElement.querySelector('input[type="time"]');
        const dateInput = form.parentElement.querySelector('input[type="date"]');
        
        if (!timeInput.value || !dateInput.value) return;
        
        addMessageToChat(messageText, timeInput.value, dateInput.value, true);
      } else {
        const now = new Date();
        const currentDate = now.toISOString().slice(0, 10);
        const currentTime = now.toTimeString().slice(0, 5);
        
        addMessageToChat(messageText, currentTime, currentDate, false);
      }
      
      // Очистка формы
      textInput.value = '';
      if (isDelayed) {
        const timeInput = form.parentElement.querySelector('input[type="time"]');
        const dateInput = form.parentElement.querySelector('input[type="date"]');
        timeInput.value = '';
        dateInput.value = '';
        
        // Снова блокируем кнопку
        const submitButton = form.querySelector('.whatsapp__submit');
        submitButton.disabled = true;
        submitButton.style.opacity = '0.5';
        submitButton.style.cursor = 'not-allowed';
      }
    });
  });

  // Функция добавления сообщения в чат
  function addMessageToChat(messageText, time, date, isDelayed) {
    const chat = document.querySelector('.whatsapp__chat');
    
    const messageElement = document.createElement('div');
    messageElement.className = 'whatsapp__manager';
    
    const textElement = document.createElement('p');
    textElement.className = 'whatsapp__text';
    textElement.textContent = messageText;
    
    const statusElement = document.createElement('div');
    statusElement.className = 'whatsapp__status';
    
    const dateElement = document.createElement('div');
    dateElement.className = 'whatsapp__date';
    dateElement.textContent = `${date} ${time}`;
    
    const checkElement = document.createElement('div');
    checkElement.className = 'whatsapp__check';
    
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

