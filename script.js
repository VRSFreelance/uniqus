// =====================
// Questions
// =====================
const questions = [
  "Does your company generate over $1 billion in gross annual revenue, entity wide?", // Q1
  "Does your company generate over $500 million in gross annual revenue, entity wide?", // Q2
  "Does your company do business in California?", // Q3
  "Does your company's annual revenue generated within California exceed $735,019 or constitute over 25% of total gross annual revenue?", // Q4
  "Is your company incorporated or commercially domiciled in California, or does it have real/tangible assets or employee payroll in California exceeding $73,502?" // Q5
];

let currentQuestion = 0;
let answers = [];
let skippedQuestions = new Set();

// =====================
// Quiz Flow
// =====================
window.addEventListener('DOMContentLoaded', loadQuestion);

function loadQuestion() {
  const questionEl = document.getElementById('quiz-question');
  if (questionEl) {
    questionEl.innerHTML = questions[currentQuestion];
  }
  updateProgress();
}

function nextQuestion(answer) {
  answers[currentQuestion] = answer;

  if (currentQuestion === 2 && answers[0] === 'NO' && answers[1] === 'NO') {
    skippedQuestions.add(3);
    skippedQuestions.add(4);
  }

  let nextIndex = currentQuestion + 1;
  while (skippedQuestions.has(nextIndex) && nextIndex < questions.length) {
    nextIndex++;
  }

  if (nextIndex < questions.length) {
    currentQuestion = nextIndex;
    loadQuestion();
  } else {
    showInfoForm();
  }
}

function showInfoForm() {
  document.getElementById('screen-quiz')?.classList.add('d-none');
  document.getElementById('info-screen')?.classList.remove('d-none');
  updateProgress();
}

function updateProgress(finished = false) {
  const totalQuestions = questions.length - skippedQuestions.size;
  const answeredQuestions = answers.filter((a, idx) => a !== undefined && !skippedQuestions.has(idx)).length;

  let pct = 0;
  if (finished) {
    pct = 100;
  } else if (!document.getElementById('info-screen').classList.contains('d-none')) {
    pct = 97;
  } else {
    pct = (answeredQuestions / totalQuestions) * 100;
  }

  // Update both progress bars
  const quizFill = document.getElementById('progressFill');
  const quizLabel = document.getElementById('progressLabel');
  if (quizFill) quizFill.style.width = pct + "%";
  if (quizLabel) quizLabel.textContent = Math.round(pct) + "%";

  const infoFill = document.getElementById('progressFillInfo');
  const infoLabel = document.getElementById('progressLabelInfo');
  if (infoFill) infoFill.style.width = pct + "%";
  if (infoLabel) infoLabel.textContent = Math.round(pct) + "%";
}

// =====================
// Compute Results
// =====================
function computeResults(userInfo = {}) {
  let SB253 = "", SB261 = "", DoingBusinessCA = "";

  const Q1 = answers[0];
  const Q2 = answers[1];
  const Q3 = answers[2];
  const Q4 = answers[3];
  const Q5 = answers[4];

  // Decision Tree Logic 
  if (Q1 === 'YES') {
    if (Q4 === 'YES' || Q5 === 'YES') {
      SB253 = SB261 = DoingBusinessCA = "Applicable";
    } else if (Q4 === 'NO' && Q5 === 'NO') {
      SB253 = SB261 = DoingBusinessCA = "Not Applicable";
    } else {
      SB253 = SB261 = DoingBusinessCA = "Unsure";
    }
  } else if (Q1 === 'UNSURE') {
    if (Q2 === 'YES') {
      if (Q4 === 'YES' || Q5 === 'YES') {
        SB253 = "Unsure"; SB261 = DoingBusinessCA = "Applicable";
      } else if (Q4 === 'NO' && Q5 === 'NO') {
        SB253 = SB261 = DoingBusinessCA = "Not Applicable";
      } else {
        SB253 = SB261 = DoingBusinessCA = "Unsure";
      }
    } else if (Q2 === 'UNSURE') {
      if (Q4 === 'YES' || Q5 === 'YES') {
        SB253 = SB261 = "Unsure"; DoingBusinessCA = "Applicable";
      } else if (Q4 === 'NO' && Q5 === 'NO') {
        SB253 = SB261 = DoingBusinessCA = "Not Applicable";
      } else {
        SB253 = SB261 = DoingBusinessCA = "Unsure";
      }
    } else if (Q2 === 'NO') {
      if (Q4 === 'YES' || Q5 === 'YES') {
        SB253 = SB261 = "Unsure"; DoingBusinessCA = "Applicable";
      } else if (Q4 === 'NO' && Q5 === 'NO') {
        SB253 = SB261 = DoingBusinessCA = "Not Applicable";
      } else {
        SB253 = SB261 = DoingBusinessCA = "Unsure";
      }
    }
  } else if (Q1 === 'NO') {
    if (Q2 === 'YES') {
      if (Q4 === 'YES' || Q5 === 'YES') {
        SB253 = "Not Applicable"; SB261 = DoingBusinessCA = "Applicable";
      } else if (Q4 === 'NO' && Q5 === 'NO') {
        SB253 = SB261 = DoingBusinessCA = "Not Applicable";
      } else {
        SB253 = SB261 = DoingBusinessCA = "Unsure";
      }
    } else if (Q2 === 'UNSURE') {
      if (Q4 === 'YES' || Q5 === 'YES') {
        SB253 = "Not Applicable"; SB261 = "Unsure"; DoingBusinessCA = "Applicable";
      } else if (Q4 === 'NO' && Q5 === 'NO') {
        SB253 = SB261 = DoingBusinessCA = "Not Applicable";
      } else {
        SB253 = "Not Applicable"; SB261 = DoingBusinessCA = "Unsure";
      }
    } else if (Q2 === 'NO') {
      if (Q3 === 'YES') {
        SB253 = SB261 = "Not Applicable"; DoingBusinessCA = "Applicable";
      } else if (Q3 === 'UNSURE') {
        SB253 = SB261 = "Not Applicable"; DoingBusinessCA = "Unsure";
      } else {
        SB253 = SB261 = DoingBusinessCA = "Not Applicable";
      }
    }
  }

  // Show Result Page
  document.getElementById('info-screen')?.classList.add('d-none');
  document.getElementById('result-screen')?.classList.remove('d-none');

  setResult("sb253", SB253);
  setResult("sb261", SB261);
  setResult("doingCA", DoingBusinessCA);

  let message = (SB253 === "Not Applicable" && SB261 === "Not Applicable")
    ? "Based on our assessment, your company may not fall under California's new climate disclosure requirements. However, we offer a wide range of solutions that could still benefit your organization."
    : "Based on your responses, your company may fall under California’s new climate disclosure requirements. Visit our website to learn what’s required and how to prepare.";

  document.getElementById('result-message').textContent = message;

  if (userInfo.email) {
    sendResultsEmail(userInfo, SB253, SB261, DoingBusinessCA, message);
  }

  updateProgress(true);
}

// =====================
// Data Helpers
// =====================
function setResult(id, status) {
  const el = document.getElementById(id);
  if (!el) return;
  const icon = el.querySelector(".icon");

  if (status === "Applicable") {
    icon.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #48297A"></i>';
  } else if (status === "Not Applicable") {
    icon.innerHTML = '<i class="bi bi-x-circle-fill" style="color: #48297A"></i>';
  } else {
    icon.innerHTML = '<i class="bi bi-question-circle-fill" style="color: #48297A"></i>';
  }
}

// =====================
// Form Handle
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById('user-info-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name')?.value || "N/A";
      const org = document.getElementById('orgname')?.value || "N/A";
      const desig = document.getElementById('designation')?.value || "N/A";
      const email = document.getElementById('email')?.value || "N/A";
      computeResults({ name, org, desig, email });
    });
  }
});

// =====================
// Email Sending
// =====================
function sendResultsEmail(userInfo, SB253, SB261, DoingBusinessCA, message) {
  const formData = new FormData();
  formData.append("name", userInfo.name);
  formData.append("orgname", userInfo.org);
  formData.append("designation", userInfo.desig);
  formData.append("email", userInfo.email);
  formData.append("sb253", SB253);
  formData.append("sb261", SB261);
  formData.append("doingCA", DoingBusinessCA);
  formData.append("message", message);

  // ✅ Add UTM values from sessionStorage
  const utmFields = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"];
  utmFields.forEach(field => {
    formData.append(field, sessionStorage.getItem(field) || "N/A");
  });

  fetch("contact.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      console.log("📩 Server response:", data);
    })
    .catch(error => {
      console.error("❌ Error sending email:", error);
    }); 
}

// =====================
// UTM Tracking (on page load)
// =====================
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"];

  utmFields.forEach(field => {
    let value = urlParams.get(field);
    if (value) {
      sessionStorage.setItem(field, value);
    }
    const input = document.getElementById(field);
    if (input) {
      input.value = sessionStorage.getItem(field) || "N/A";
    }
  });
});
