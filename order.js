function setChoice(option) {
  localStorage.setItem("orderType", option);

  // ✅ go to menu.html after selecting
  window.location.href = "menu.html";
}
