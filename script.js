document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("landing-page").classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("popup").classList.add("hidden");
  document.getElementById("backimg").style.display = "none";
});

document.getElementById("start").addEventListener("click", function () {
  window.location.href = "user_details.html"
});
