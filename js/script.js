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
});
