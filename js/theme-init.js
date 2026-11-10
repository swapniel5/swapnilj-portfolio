(() => {
  let savedTheme;
  try {
    savedTheme = localStorage.getItem("swapnilj-portfolio-theme");
  } catch {
    savedTheme = null;
  }

  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "dark" ? "#0b1724" : "#ffffff";
})();
