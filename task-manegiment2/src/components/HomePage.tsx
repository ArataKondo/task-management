import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../task.css'

type Task = { completed: boolean; priority: number; text: string; id: string }
const STORAGE_KEY = 'watnow_tasks'

export default function HomePage(): JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setTasks(raw ? JSON.parse(raw) : [])
    } catch {
      setTasks([])
    }
  }, [])

  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  const pending = tasks.filter((t) => !t.completed)
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <main className="home-container container">
      <header className="home-header">
        <div>
          <p className="subtitle"></p>
          <h1>ホーム</h1>
        </div>
      </header>

      <section className="summary-card">
        <div className="summary-label">達成率</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${rate}%` }} />
        </div>
        <div className="summary-values">
          <strong>{`${rate}%`}</strong>
          <span>{`完了 ${completed} / ${total}`}</span>
        </div>
      </section>

      <section className="pending-card">
        <div className="section-header">
          <div>
            <h2>未消化タスク</h2>
            <p className="section-subtitle">優先度順に表示します</p>
          </div>
          <span>{`${pending.length} 件`}</span>
        </div>
        <ul className="pending-list">
          {pending.length === 0 ? (
            <li className="empty-state">未消化タスクはありません。</li>
          ) : (
            pending
              .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))
              .map((task) => (
                <li key={task.id} className="pending-item">
                  <span className="pending-task-title">{task.text}</span>
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority === 3 ? '高' : task.priority === 2 ? '中' : '低'}</span>
                </li>
              ))
          )}
        </ul>
      </section>

      <footer className="bottom-nav">
        <Link to="/" className="nav-item active">ホーム</Link>
        <Link to="/task" className="nav-item">タスク追加</Link>
        <Link to="/calendar" className="nav-item">カレンダー</Link>
      </footer>
    </main>
  )
}
