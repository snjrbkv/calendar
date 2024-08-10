document.addEventListener("DOMContentLoaded", () => {
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

  const daysInMonth = new Date(2024, 8, 0).getDate(); // Сентябрь 2024
  const calendar = document.getElementById("calendar");
  const taskHeader = document.getElementById("task-header");
  const taskDetails = document.getElementById("task-details");
  const surveyForm = document.getElementById("survey-form");
  const surveyHours = document.getElementById("survey-hours");
  const surveyUnderstanding = document.getElementById("survey-understanding");
  const successSound = document.getElementById("successSound");

  const getSavedState = () => {
    const savedState = localStorage.getItem("markedDays");
    return savedState ? JSON.parse(savedState) : [];
  };

  const saveState = (state) => {
    localStorage.setItem("markedDays", JSON.stringify(state));
  };

  const markedDays = getSavedState();

  const updateTaskHeader = (taskIndex) => {
    const task = tasks[taskIndex];
    taskHeader.innerHTML = `Task for the day: <a href="${task.link}" target="_blank">${task.text}</a>`;
    taskDetails.textContent = task.details;
  };

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
      if (day.classList.contains("disabled")) return;

      if (day.classList.contains("active")) return;

      // Проверяем, если инпуты заполнены корректно
      if (surveyHours.value && surveyUnderstanding.value) {
        const hours = parseFloat(surveyHours.value);
        const understanding = parseFloat(surveyUnderstanding.value);

        if (hours <= 9 && understanding <= 100) {
          day.classList.add("active");
          markedDays.push(i);
          saveState(markedDays);
          successSound.play();

          if (i < daysInMonth) {
            const nextTaskIndex = i % tasks.length;
            updateTaskHeader(nextTaskIndex);
          } else {
            taskHeader.textContent = "All tasks completed for this month!";
            taskDetails.textContent = "";
          }

          // Разблокируем следующий день
          const nextDay = calendar.querySelector(`.day:nth-child(${i + 1})`);
          if (nextDay) nextDay.classList.remove("disabled");
        } else {
          alert("Hours must be up to 9 and understanding must be up to 100%");
        }
      } else {
        alert("Please fill in both fields before marking the day.");
      }
    });

    calendar.appendChild(day);
  }

  surveyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const hours = parseFloat(surveyHours.value);
    const understanding = parseFloat(surveyUnderstanding.value);

    if (hours <= 9 && understanding <= 100) {
      const selectedDay = document.querySelector(".day.active");
      if (selectedDay) {
        const dayNumber = parseInt(selectedDay.textContent);

        // Проверяем, если день еще не закрашен
        if (!markedDays.includes(dayNumber)) {
          markedDays.push(dayNumber);
          saveState(markedDays);
          successSound.play();
        }
      }
    } else {
      alert("Please ensure hours are up to 9 and understanding is up to 100%");
    }
  });
});
