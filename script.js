/* ==========================================================================
   MODULE 1: EMAIL PHISHING QUIZ LOGIC
   ========================================================================== */
const emailScenarios = [
  {
    sender: "security-alert@netfIix-billing-update.com",
    subject: "CRITICAL: Account suspension notice",
    body: "Dear Customer,<br><br>Your payment method failed. Click <a href='#'>here</a> immediately to verify your credit card details or your account will be deleted in 24 hours.",
    isLegit: false,
    explanation: "Scam! Look at the domain name ('netfIix' uses a capital 'I' instead of 'l'). Legitimate companies do not threaten rapid account deletion via unverified links."
  },
  {
    sender: "no-reply@accounts.google.com",
    subject: "Security Alert: New device login detected",
    body: "Your Google Account was logged into from a new Windows workstation. If this was you, no action is needed. If not, check your account security activity page.",
    isLegit: true,
    explanation: "Legitimate! Sender domain (@accounts.google.com) is valid, and the email directs you to native account settings without asking for credentials."
  },
  {
    sender: "payouts@lottery-grand-prize.org",
    subject: "You won $250,000 in the International Tech Raffle!",
    body: "Congratulations! You won $250,000. To release your payout, wire a $200 processing fee via Gift Card codes.",
    isLegit: false,
    explanation: "Scam! Genuine lotteries and contests never require winner processing fees or gift card payments."
  }
];

let quizIndex = 0;
let quizScore = 0;

function renderQuizScenario() {
  const current = emailScenarios[quizIndex];
  document.getElementById("email-sender").innerText = current.sender;
  document.getElementById("email-subject").innerText = current.subject;
  document.getElementById("email-body").innerHTML = current.body;

  document.getElementById("quiz-feedback").style.display = "none";
  document.getElementById("quiz-actions").style.display = "flex";
  document.getElementById("quiz-next-btn").style.display = "none";
}

function evaluateQuiz(userChoice) {
  const current = emailScenarios[quizIndex];
  const feedback = document.getElementById("quiz-feedback");
  const isCorrect = (userChoice === current.isLegit);

  if (isCorrect) {
    quizScore++;
    feedback.className = "feedback-banner correct";
    feedback.innerHTML = "✔ Correct! " + current.explanation;
  } else {
    feedback.className = "feedback-banner incorrect";
    feedback.innerHTML = "✖ Incorrect. " + current.explanation;
  }

  document.getElementById("quiz-score-display").innerText = `${quizScore} / ${emailScenarios.length}`;
  feedback.style.display = "block";
  document.getElementById("quiz-actions").style.display = "none";
  document.getElementById("quiz-next-btn").style.display = "block";
}

function nextQuizQuestion() {
  quizIndex = (quizIndex + 1) % emailScenarios.length;
  renderQuizScenario();
}

/* ==========================================================================
   MODULE 2: AI SCAM CALL SIMULATOR LOGIC
   ========================================================================== */
let callActive = false;
let callStep = 0;

const callScript = [
  {
    caller: "[Caller]: Hello! I'm calling from your bank's anti-fraud team. We detected an unauthorized charge of $1,250. Can you confirm your 16-digit debit card number to stop it?",
    choices: [
      { text: "Provide card details immediately", result: "fail", response: "[ALERT]: Never read card numbers or PINs to incoming callers!" },
      { text: "Ask: 'Which specific bank are you calling from?'", result: "next", response: "" },
      { text: "Hang up and call the number on the back of your card", result: "pass", response: "[SUCCESS]: Perfect response! Hanging up and contacting your official branch directly is the safest path." }
    ]
  },
  {
    caller: "[Caller]: Sir/Ma'am, we are calling from First Federal Bank! If you do not verify the card number within 60 seconds, your account will be frozen!",
    choices: [
      { text: "Panic and read the card number", result: "fail", response: "[ALERT]: Scammers rely on artificial urgency to bypass logic." },
      { text: "Hang up and check your official banking app", result: "pass", response: "[SUCCESS]: Excellent! You avoided a panic-driven scam attempt." }
    ]
  }
];

function toggleCallSimulation() {
  const btn = document.getElementById("call-toggle-btn");
  const statusText = document.getElementById("call-status-text");
  const log = document.getElementById("call-terminal-log");

  if (!callActive) {
    callActive = true;
    callStep = 0;
    btn.innerText = "Terminate Simulation";
    btn.className = "btn btn-danger";
    statusText.innerText = "Active Call";
    document.getElementById("sim-status-display").innerText = "Call Active";
    log.innerHTML = `<p style="color:#64748b;">[System]: Incoming encrypted call connected...</p>`;
    
    speakText("Hello! I am calling from your bank's anti fraud team.");
    renderCallStep();
  } else {
    terminateCallSimulation("Simulation ended by user.");
  }
}

function renderCallStep() {
  const log = document.getElementById("call-terminal-log");
  const choicesBox = document.getElementById("call-choices");
  const currentStep = callScript[callStep];

  if (!currentStep) return;

  log.innerHTML += `<p style="color:#f8fafc;">${currentStep.caller}</p>`;
  log.scrollTop = log.scrollHeight;

  choicesBox.innerHTML = "";
  currentStep.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = c.text;
    btn.onclick = () => processCallChoice(c);
    choicesBox.appendChild(btn);
  });
}

function processCallChoice(choice) {
  const log = document.getElementById("call-terminal-log");
  const choicesBox = document.getElementById("call-choices");

  log.innerHTML += `<p style="color:#60a5fa;">> You selected: "${choice.text}"</p>`;
  choicesBox.innerHTML = "";

  if (choice.result === "fail" || choice.result === "pass") {
    log.innerHTML += `<p style="color: ${choice.result === 'pass' ? '#4ade80' : '#f87171'}; font-weight:bold;">${choice.response}</p>`;
    terminateCallSimulation("Session Completed");
  } else if (choice.result === "next") {
    callStep++;
    renderCallStep();
  }
}

function terminateCallSimulation(reason) {
  callActive = false;
  document.getElementById("call-toggle-btn").innerText = "Initiate Call Simulation";
  document.getElementById("call-toggle-btn").className = "btn btn-primary