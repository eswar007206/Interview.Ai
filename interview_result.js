import API_KEY from "./api_key.js";
const apiUrl = "https://api.mistral.ai/v1/chat/completions";

const userName = localStorage.getItem("username");
document.getElementById("username").textContent = `Hello ${userName}!`;

const answers = JSON.parse(sessionStorage.getItem("interviewData"));

const totalQuestions = answers.length; // Ensuring it always takes the right number of questions

const formattedAnswers = answers
  .map((answer, index) => {
    return `Q${index + 1}: ${answer.question}\nAnswer: ${answer.answer}`;
  })
  .join("\n\n");

console.log("User responses:\n", formattedAnswers);

// **Updated AI Request for More Reliable Feedback**
const requestBody = {
  model: "mistral-tiny",
  messages: [
    { role: "system", content: "You are an AI interviewer. Be **strict** in grading correctness and only count valid responses." },
    {
      role: "user",
      content: `Evaluate this interview:
      - Check correctness of answers.
      - Total correct answers should **never exceed** the total number of questions (${totalQuestions}).
      - Give an **honest** score (1-10) based only on correctness & depth.
      - **DO NOT** add extra text like 'Great job' if the performance is poor.
      - Provide a **realistic** short feedback.

      Return JSON format:
      {
        "correct_answers": total_correct,
        "total_questions": ${totalQuestions},
        "final_score": 1-10,
        "feedback": "Short but realistic feedback."
      }

      Responses:
      ${formattedAnswers}`,
    },
  ],
  max_tokens: 500,
};

async function getRating() {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("API Response:", data);

    const result = JSON.parse(data?.choices[0]?.message?.content || "{}");

    // Ensure correct answers count never exceeds total questions
    const correctAnswers = Math.min(result.correct_answers || 0, totalQuestions);

    // Construct feedback message
    document.getElementById("rating-box").innerHTML = `
      <h2>Final Score: ${result.final_score}/10</h2>
      <p>✅ Correct Answers: ${correctAnswers}/${totalQuestions}</p>
      <p>📢 Feedback: ${result.feedback}</p>
    `;
  } catch (error) {
    console.error("Error fetching rating:", error);
  }
}

getRating();
