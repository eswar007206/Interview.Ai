const proceedHandler = document.querySelector("#proceed-bth");

proceedHandler.addEventListener("click", function () {
  // The empty case need to be handled

  const username = document.querySelector("#username").value;

  if (username === "") {
    alert("Please enter a username.");
    return;
  }

  localStorage.setItem("username", username);

  window.location.href = "interview_details.html";
});
