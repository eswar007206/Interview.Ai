const skills = document.getElementById("skills");
const role = document.getElementById("role");
const experience = document.getElementById("experience");
const startInterviewBtn = document.getElementById("start-interview");

startInterviewBtn.addEventListener("click", () => {
  if (!skills.value || !role.value || !experience.value) {
    return;
  }

  const filteredSkills = skills.value
    .split(",")
    .map((skill) => skill.trim().toLowerCase())
    .join(",");

  const filteredRole = role.value.trim().toLowerCase();
  const filteredExperience = experience.value.trim().toLowerCase();

  const interviewUrl = `interview_portal.html?skills=${filteredSkills}&role=${filteredRole}&experience=${filteredExperience}`;
  window.location.href = interviewUrl;
});
