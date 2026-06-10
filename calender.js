const STORAGE_KEY = 'watnow_tasks';
const calendarEl = document.getElementById('calendar');

const getTasks = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const mapTaskToEvent = (task) => ({
  id: task.id,
  title: task.text,
  start: task.time ? `${task.date}T${task.time}` : task.date,
  allDay: !task.time,
  backgroundColor: task.color || '#5dc4ff',
  borderColor: task.color || '#5dc4ff',
  textColor: '#ffffff',
});

const renderCalendar = () => {
  const eventList = getTasks().map(mapTaskToEvent);
  new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'ja',
    eventDisplay: 'block',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: eventList,
  }).render();
};

window.addEventListener('DOMContentLoaded', renderCalendar);
