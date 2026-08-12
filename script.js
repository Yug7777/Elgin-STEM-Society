/* ====================================
   1. EMAIL QUIZ DATA & LOGIC
   ==================================== */
const questions = [
  {
    from: "support@netfIix-security-alert.com",
    subject: "URGENT: Your Account Has Been Suspended",
    body: "Dear Customer,<br><br>We detected unusual activity on your account. Please click <a href='#'>here</a> to verify your credit card details within 24 hours or your subscription will be permanently canceled.",
    isReal: false,
    explanation: "Fake! Look closely at the domain name ('netfIix' uses a capital 'I' instead of an 'l'). Legitimate services will not threaten immediate cancellation via an external link."
  },
  {
    from: "no-reply@accounts.google.com",
    subject: "Security Alert: New sign-in from Chrome on Windows",
    body: "Your Google Account was just signed in to from a new Windows device. If this was you, you don't need to do anything. If not, check your recent activity page.",
    isReal: true,
    explanation: "Real! The sender domain (@accounts.google.com) is authentic, and the email does not demand private security credentials or lead to third-party payment forms."
  },
  {
    from: "claims@lottery-winner-payouts.org",
    subject: "You won $50,000 in the International Tech Draw!",
    body: "Congratulations! You have been randomly selected to receive $50,000. To claim your reward, send a small processing fee of $150 via Gift Card code.",
    isReal: false,
    explanation: "Fake! Legitimate sweepstakes and lotteries never demand an upfront processing fee or gift cards to release winnings."
  }
];

let currentQuestionIndex = 0;

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  document.getElementById("email-from").innerText = q.from;
  document.getElementById("email-subject").innerText = q.subject;
  document.getElementById("email-body").innerHTML = q.body;
  
  document.getElementById("feedback-box").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("quiz-buttons").style.display = "flex";
}

function checkAnswer(userChoice) {
  const q = questions[currentQuestionIndex];
  const feedbackBox = document.getElementById("feedback-box");
  const isCorrect = userChoice === q.isReal;

  feedbackBox.style.display = "block";
  if (isCorrect) {
    feedbackBox.className = "feedback correct";
    feedbackBox.innerHTML = "✔ Correct! " + q.explanation;
  } else {
    feedbackBox.className = "feedback incorrect";
    feedbackBox.innerHTML = "✖ Incorrect. " + q.explanation;
  }

  document.getElementById("quiz-buttons").style.display = "none";
  document.getElementById("next-btn").style.display = "block";
}

function loadNextQuestion() {
  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
  loadQuestion();
}

/* ====================================
   2. AI SCAM CALL SIMULATOR LOGIC
   ==================================== */
let isCallActive = false;
let callStep = 0;

const callScript = [
  {
    scammer: "[Caller]: Hello! I am calling from your Bank's Fraud Prevention Unit. We noticed a suspicious charge of $899 on your debit card. Can you confirm your 16-digit card number to cancel it?",
    options: [
      { text: "Give them card details to fix it fast", action: "fail_card" },
      { text: "Ask which bank they are calling from specifically", action: "ask_bank" },
      { text: "Hang up immediately and call the official bank number directly", action: "pass" }
    ]
  },
  {
    scammer: "[Caller]: Sir/Ma'am, we are calling from Universal Central Bank! If you do not verify the card number right now, your account will be locked indefinitely!",
    options: [
      { text: "Panic and read out the card details", action: "fail_card" },
      { text: "Hang up and verify through your official mobile banking application", action: "pass" }
    ]
  }
];

function toggleCall() {
  const btn = document.getElementById("toggle-call-btn");
  const dot = document.getElementById("status-dot");
  const statusText = document.getElementById("call-status");
  const log = document.getElementById("call-log");

  if (!isCallActive) {
    // Start Call Simulation
    isCallActive = true;
    callStep = 0;
    btn.innerText = "End Call";
    btn.classList.add("end");
    dot.classList.add("active");
    statusText.innerText = "Call Connected (Unknown Number)";
    log.innerHTML = "<strong>[System]: Call Connected...</strong><br>";
    
    // Voice speech synthesis execution
    speakText("Hello! I am calling from your Bank Fraud Prevention Unit.");
    
    displayCallStep();
  } else {
    // Terminate Call
    endCall("Call Ended by User.");
  }
}

function displayCallStep() {
  const log = document.getElementById("call-log");
  const choicesBox = document.getElementById("user-choices");
  const stepData = callScript[callStep];

  if (!stepData) return;

  log.innerHTML += `<br><div>${stepData.scammer}</div>`;
  log.scrollTop = log.scrollHeight;

  choicesBox.style.display = "flex";
  choicesBox.innerHTML = "";

  stepData.options.forEach(opt => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.innerText = opt.text;
    button.onclick = () => handleUserChoice(opt);
    choicesBox.appendChild(button);
  });
}

function handleUserChoice(option) {
  const log = document.getElementById("call-log");

  log.innerHTML += `<br><div style="color: #60a5fa;">> You: ${option.text}</div>`;

  if (option.action === "fail_card") {
    log.innerHTML += `<br><div style="color: #f87171;"><strong>[ALERT]: Scam vector hit. Never provide card numbers or security tokens during incoming unverified phone calls.</strong></div>`;
    endCall("Simulation Failed");
  } else if (option.action === "pass") {
    log.innerHTML += `<br><div style="color: #4ade80;"><strong>[SUCCESS]: Perfect response. Hanging up and dialing official bank contacts directly removes the threat.</strong></div>`;
    endCall("Simulation Passed");
  } else if (option.action === "ask_bank") {
    callStep++;
    displayCallStep();
  }
}

function endCall(reason) {
  isCallActive = false;
  const btn = document.getElementById("toggle-call-btn");
  const dot = document.getElementById("status-dot");
  const statusText = document.getElementById("call-status");
  const choicesBox = document.getElementById("user-choices");
  const log = document.getElementById("call-log");

  btn.innerText = "Start Scam Call Simulation";
  btn.classList.remove("end");
  dot.classList.remove("active");
  statusText.innerText = "Call Disconnected";
  choicesBox.style.display = "none";
  log.innerHTML += `<br><br><em>[System]: ${reason}</em>`;
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
}

// Initializing Quiz State on Load
document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
});