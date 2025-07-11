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
});
