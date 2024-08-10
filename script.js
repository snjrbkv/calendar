// Инициализация Google API
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  gapi.client
    .init({
      apiKey: "YOUR_API_KEY",
      clientId: "YOUR_CLIENT_ID.apps.googleusercontent.com",
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
      scope: "https://www.googleapis.com/auth/calendar.events",
    })
    .then(() => {
      // Подключение слушателя событий кликов
      document.querySelectorAll(".day").forEach((day) => {
        day.addEventListener("click", () => {
          let dayNumber = day.textContent;
          let eventDate = new Date(2024, 8, dayNumber);

          // Добавление/удаление события в Google Календаре
          if (day.classList.contains("active")) {
            createGoogleCalendarEvent(eventDate);
          } else {
            deleteGoogleCalendarEvent(eventDate);
          }
        });
      });
    });
}

function createGoogleCalendarEvent(date) {
  let event = {
    summary: "Закрашенный день",
    start: {
      date: date.toISOString().split("T")[0],
    },
    end: {
      date: date.toISOString().split("T")[0],
    },
  };

  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
    })
    .then((response) => {
      console.log("Event created: ", response);
    });
}

function deleteGoogleCalendarEvent(date) {
  // Логика удаления события из Google Календаря
  console.log("Delete event for date: ", date);
}

// Подключение Google API скрипта
const script = document.createElement("script");
script.src = "https://apis.google.com/js/api.js";
script.onload = handleClientLoad;
document.body.appendChild(script);
