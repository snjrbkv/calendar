// Подключение к элементам
const calendar = document.getElementById("calendar");
const taskHeader = document.getElementById("task-header");
const taskDetails = document.getElementById("task-details");
const successSound = document.getElementById("successSound");
const surveyForm = document.querySelector(".survey");
const understandingInput = document.getElementById("understanding");
const hoursInput = document.getElementById("hours");
const statisticsDiv = document.getElementById("statistics");

const tasks = [
  {
    text: "Grammar: English Grammar in Use by Raymond Murphy",
    link: "https://www.cambridge.org/elt/englishgrammarinuse",
    details:
      "Spend 30-45 minutes reviewing key grammar topics. Focus on areas where you feel less confident.",
  },
  {
    text: "Vocabulary: Quizlet or Memrise",
    link: "https://quizlet.com",
    details:
      "Spend 20-30 minutes learning new words or revising vocabulary sets. Practice using words in sentences.",
  },
  {
    text: "Listening: IELTS Listening Practice Tests",
    link: "https://www.ielts.org/about-the-test/sample-test-questions",
    details:
      "Complete a full listening practice test (approximately 30 minutes). Focus on understanding both the general meaning and specific details.",
  },
  {
    text: "Speaking: iTalki or Cambly",
    link: "https://www.italki.com",
    details:
      "Spend 15-30 minutes speaking with a tutor or language partner. Practice answering common IELTS speaking questions.",
  },
  {
    text: "Reading: BBC News or The Guardian",
    link: "https://www.bbc.com/news",
    details:
      "Read articles for 30-45 minutes. Focus on identifying main ideas and understanding complex sentences.",
  },
  {
    text: "Writing: IELTS Liz or Write & Improve",
    link: "https://ieltsliz.com",
    details:
      "Spend 30-60 minutes practicing writing tasks. Focus on essay structure and expressing your ideas clearly.",
  },
  {
    text: "Mock Test: Road to IELTS or IELTS.org",
    link: "https://www.ielts.org",
    details:
      "Spend 2-3 hours completing a full mock test. Simulate real test conditions as closely as possible.",
  },
];

// Функция для получения сохраненного состояния
const getSavedState = () => {
  const savedState = localStorage.getItem("markedDays");
  return savedState ? JSON.parse(savedState) : [];
};

// Функция для сохранения состояния
const saveState = (state) => {
  localStorage.setItem("markedDays", JSON.stringify(state));
};

// Загрузка сохраненного состояния
const markedDays = getSavedState();

// Функция для обновления заголовка задания и деталей
const updateTaskHeader = (taskIndex) => {
  const task = tasks[taskIndex];
  taskHeader.innerHTML = `Task for the day: <a href="${task.link}" target="_blank">${task.text}</a>`;
  taskDetails.textContent = task.details;
};

// Инициализация календаря
const daysInMonth = new Date(2024, 8, 0).getDate(); // Сентябрь 2024
for (let i = 1; i <= daysInMonth; i++) {
  const day = document.createElement("div");
  day.className = "day";
  day.textContent = i;

  const taskIndex = (i - 1) % tasks.length;
  if (i === 1) {
    updateTaskHeader(taskIndex);
  }

  if (markedDays.includes(i)) {
    day.classList.add("active");
  }

  if (i > 1 && !markedDays.includes(i - 1)) {
    day.classList.add("disabled");
  }

  day.addEventListener("click", () => {
    if (!day.classList.contains("disabled")) {
      alert("Пожалуйста, сначала заполните опрос, чтобы закрасить этот день.");
    }
  });

  calendar.appendChild(day);
}

// Обработка отправки формы опроса
surveyForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const understanding = parseInt(understandingInput.value);
  const hours = parseFloat(hoursInput.value);

  if (understanding >= 0 && understanding <= 100 && hours >= 0 && hours <= 9) {
    const currentDay = markedDays.length + 1;

    // Обновляем прогресс
    markedDays.push(currentDay);
    saveState(markedDays);

    // Закрашиваем текущий день
    const dayElement = calendar.querySelector(`.day:nth-child(${currentDay})`);
    if (dayElement) {
      dayElement.classList.add("active");
      dayElement.classList.remove("disabled");
      successSound.play();
    }

    // Обновляем заголовок задания на следующий день
    if (currentDay < daysInMonth) {
      const nextTaskIndex = currentDay % tasks.length;
      updateTaskHeader(nextTaskIndex);
    } else {
      taskHeader.textContent = "All tasks completed for this month!";
      taskDetails.textContent = "";
    }

    // Обновляем статистику
    const totalHours = markedDays.reduce((acc, day) => acc + hours, 0);
    const totalUnderstanding = markedDays.reduce(
      (acc, day) => acc + understanding,
      0
    );
    const averageUnderstanding = totalUnderstanding / markedDays.length;

    statisticsDiv.innerHTML = `
      <p>Total time spent: ${totalHours.toFixed(1)} hours</p>
      <p>Average understanding: ${averageUnderstanding.toFixed(1)}%</p>
    `;

    // Очищаем форму
    surveyForm.reset();
  } else {
    alert(
      "Пожалуйста, введите корректные значения: понимание должно быть от 0 до 100, а часы от 0 до 9."
    );
  }
});
