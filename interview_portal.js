import API_KEY from "./api_key.js";

// Processing the query parameters

const params = new URLSearchParams(window.location.search);

const skills = params.get("skills")?.split(",");
const role = params.get("role");
const experience = params.get("experience");

// Storing the answers

const answers = new Array(10).fill("");
let answerIndex = 0;

let recognition;

// Fetching the interview questions

const apiUrl = "https://api.mistral.ai/v1/chat/completions";
let questions = null;

const requestBody = {
  model: "mistral-tiny",

  messages: [
    { role: "system", content: "You are an AI interviewer." },

    {
      role: "user",
      content: `Generate 10 interview questions for a ${role} with ${experience} years of experience in ${skills?.join(
        ", "
      )}.`,
    },
  ],
  max_tokens: 500,
};

async function getQuestions() {
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

    questions = data?.choices[0]?.message?.content.split("\n");
    displayQuestion();
    setQuestionIndex(1, questions.length);
    console.log(questions);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Displaying the questions

let questionIndex = 0;
// const questionElement = document.getElementById("question-text");
const nextQuestionButton = document.getElementById("next");

function displayQuestion() {
  const question = questions[questionIndex];
  // questionElement.textContent = question;
  speak(question.slice(3));
  textFillingAnimation("question-text", question);
}

// Next question button

nextQuestionButton.addEventListener("click", () => {
  console.log(answers);

  if (questionIndex < questions.length - 1) {
    questionIndex++;
  } else {
    return;
  }

  document.querySelector("#answer").textContent = "";
  finalTranscript = "";

  if (questionIndex === questions.length - 1) {
    document.getElementById("submit").removeAttribute("disabled");
    nextQuestionButton.setAttribute("disabled", true);
  }

  displayQuestion();
  setQuestionIndex(questionIndex + 1, questions.length);
  stopSpeechRecognition();
  answerIndex++;
});

const questionNum = document.getElementById("question-num");

function setQuestionIndex(index, total) {
  questionNum.textContent = `${index}/${total}`;
}

// Text filling animation

function textFillingAnimation(id, text) {
  const el = document.getElementById(id);
  let index = 0;

  el.textContent = "";

  const interval = setInterval(() => {
    el.textContent += text[index];
    index++;

    if (index > text.length - 1) {
      clearInterval(interval);
    }
  }, 50);
}

// Casting the camera

const video = document.getElementById("video");

function startCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error("Error Camera:", error);
    });
}

// Timer

const timer = document.getElementById("timer");
let totalSeconds = 0;

function startTimer() {
  setInterval(() => {
    totalSeconds++;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timer.textContent = minutes + "m " + ": " + seconds + "s";
  }, 1000);
}

// Speech recognition

let finalTranscript = "";

function startSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert(
      "Speech Recognition is not supported in this browser. Please use Google Chrome."
    );
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  // Get elements
  const output = document.getElementById("answer");
  // const startBtn = document.getElementById("start-speaking");

  // Start speech recognition
  // startBtn.addEventListener("click", () => {
  //   recognition.start();
  //   startBtn.disabled = true;
  //   startTimer();
  // });

  // Capture speech results

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + " "; // Store final transcript
      } else {
        transcript += event.results[i][0].transcript; // Show live transcript
      }
    }

    output.innerText = finalTranscript + transcript; // Live update while speaking

    // Store the answer

    answers[answerIndex] = finalTranscript + transcript;
  };

  // Auto-restart speech recognition when it stops
  // recognition.onend = () => {
  //   console.log("Auto-restarting recognition...");
  //   recognition.start();
  // };

  // Handle errors
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
}

function stopSpeechRecognition() {
  recognition.stop();
  document.getElementById("start-speaking").setAttribute("disabled", "true");
  console.log("Speech recognition stopped.");
}

// Text to speech synthesis

function speak(text) {
  let speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-IN"; // Set language
  speech.rate = 1; // Speed (0.5 - slow, 1 - normal, 2 - fast)
  speech.pitch = 1; // Pitch (0 - low, 1 - normal, 2 - high)
  speech.volume = 1; // Volume (0 to 1)

  window.speechSynthesis.speak(speech);
  playRobotIsTalking();

  speech.onend = () => {
    recognition.start();
    document.getElementById("start-speaking").removeAttribute("disabled");
    playRobotIsIdle();
  };
}

// Passing the answers to the next page

const submitButton = document.getElementById("submit");

function formatTheQuestionAndAns() {
  let formattedData = [];

  for (let i = 0; i < questions.length; i++) {
    formattedData.push({
      question: questions[i].slice(3),
      answer: answers[i],
    });
  }

  return formattedData;
}

document.getElementById("submit").addEventListener("click", () => {
  const data = formatTheQuestionAndAns();
  console.log(data);

  sessionStorage.setItem("interviewData", JSON.stringify(data));
  window.location.href = "interview_result.html";
});

// Robot animation

function playRobotIsTalking() {
  const robot = document.getElementById("robot-ai");
  robot.setAttribute("src", "talking.mp4");
}

function playRobotIsIdle() {
  const robot = document.getElementById("robot-ai");
  robot.setAttribute("src", "ideal.mp4");
}

// After the dom content is loaded

document.addEventListener("DOMContentLoaded", () => {
  startTimer();
  playRobotIsIdle();
  startSpeechRecognition();
  startCamera();
  getQuestions();
});
