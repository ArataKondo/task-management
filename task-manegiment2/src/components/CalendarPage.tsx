import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../task.css'
import '@fullcalendar/common/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'

const STORAGE_KEY = 'watnow_tasks'

export default function CalendarPage(): JSX.Element {
  const calRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Use FullCalendar via CDN if global exists
    const el = calRef.current
    if (!el) return

    // Dynamically import FullCalendar only in browser
    import('@fullcalendar/core').then((FullCalendar) => {
      Promise.all([
        import('@fullcalendar/daygrid'),
        import('@fullcalendar/timegrid'),
      ]).then(([dayGridModule, timeGridModule]) => {
        const Calendar = (FullCalendar as any).Calendar
        const plugins = [dayGridModule.default, timeGridModule.default]
        const raw = localStorage.getItem(STORAGE_KEY)
        let events = []
        try {
          const tasks = raw ? JSON.parse(raw) : []
          events = tasks.map((task: any) => ({
            id: task.id,
            title: task.text,
            start: task.time ? `${task.date}T${task.time}` : task.date,
            allDay: !task.time,
            backgroundColor: task.color || '#5dc4ff',
            borderColor: task.color || '#5dc4ff',
            textColor: '#ffffff',
          }))
        } catch {
          events = []
        }

        const cal = new Calendar(el, {
          initialView: 'dayGridMonth',
          locale: 'ja',
          eventDisplay: 'block',
          height: 'auto',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          },
          plugins,
          events,
        })
        cal.render()
      })
    }).catch(() => {
      // ignore if FullCalendar not available
    })
  }, [])

  return (
    <main className="calendar-container container">
      <header className="calendar-header">
        <div>
          <p className="subtitle">予定を確認</p>
          <h1>カレンダー</h1>
        </div>
      </header>

      <section className="calendar-board">
        <div id="calendar" ref={calRef}></div>
      </section>

      <footer className="bottom-nav">
        <Link to="/" className="nav-item">ホーム</Link>
        <Link to="/task" className="nav-item">タスク</Link>
        <Link to="/calendar" className="nav-item active">カレンダー</Link>
      </footer>
    </main>
  )
}
