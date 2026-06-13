import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../task.css'

type Task = {
  id: string
  text: string
  completed: boolean
  priority: number
  date: string
  time: string
  category: string
  color?: string
}

const STORAGE_KEY = 'watnow_tasks'

const CATEGORY_COLOR: Record<string, string> = {
  school: '#7c9cff',
  work: '#7ff3c8',
  life: '#ffd57f',
  other: '#d5a6ff',
}

const CATEGORY_LABEL: Record<string, string> = {
  school: '学校',
  work: 'バイト',
  life: '生活',
  other: 'その他',
}

export default function TaskPage(): JSX.Element {
  const [text, setText] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<number>(2)
  const [category, setCategory] = useState('work')
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      setTasks(raw ? JSON.parse(raw) : [])
    } catch (e) {
      setTasks([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const color = useMemo(() => CATEGORY_COLOR[category] || '#7ff3c8', [category])

  const getPriorityLabel = (p: number) => {
    if (p === 3) return '高'
    if (p === 2) return '中'
    return '低'
  }

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority
      if (a.date !== b.date) return (a.date || '').localeCompare(b.date || '')
      return (a.time || '').localeCompare(b.time || '')
    })
  }, [tasks])

  const addTask = () => {
    const t = text.trim()
    if (!t) return
    const newTask: Task = {
      id: String(Date.now()),
      text: t,
      completed: false,
      priority,
      date: date || new Date().toISOString().slice(0, 10),
      time: time || '',
      category,
      color,
    }
    setTasks((s) => [...s, newTask])
    setText('')
    setDate('')
    setTime('')
    setPriority(2)
    setCategory('work')
  }

  const toggleCompleted = (id: string, checked: boolean) => {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, completed: checked } : t)))
  }

  const removeTask = (id: string) => {
    setTasks((s) => s.filter((t) => t.id !== id))
  }

  return (
    <div className="container">
      <h1>今後のタスク</h1>
      <p className="subtext">日付・時間・カテゴリーを設定して、色で予定を分けながら素早く追加！</p>

      <div className="input-area task-form">
        <div className="field-group full-width">
          <label htmlFor="task-input">タスク</label>
          <input
            id="task-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="例：善太と夜ご飯"
          />
        </div>

        <div className="field-row">
          <div className="field-group">
            <label htmlFor="task-date">日付</label>
            <input id="task-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="field-group">
            <label htmlFor="task-time">時間</label>
            <input id="task-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div className="field-row category-row">
          <div className="field-group">
            <label htmlFor="priority-select">優先度</label>
            <select id="priority-select" value={String(priority)} onChange={(e) => setPriority(Number(e.target.value))} aria-label="タスク優先度">
              <option value="3">高</option>
              <option value="2">中</option>
              <option value="1">低</option>
            </select>
          </div>
          <div className="field-group category-group">
            <label htmlFor="category-select">カテゴリー</label>
            <div className="category-control">
              <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="カテゴリー選択">
                <option value="school">学校</option>
                <option value="work">バイト</option>
                <option value="life">生活</option>
                <option value="other">その他</option>
              </select>
              <span id="category-swatch" className="category-swatch" style={{ background: color }} aria-hidden="true" />
            </div>
          </div>
        </div>

        <button id="add-task-btn" className="full-width" onClick={addTask}>タスク追加</button>
      </div>

      <ul id="task-list">
        {sortedTasks.length === 0 ? (
          <p className="empty-state">まずはタスクを追加してください。</p>
        ) : (
          sortedTasks.map((task) => (
            <li key={task.id} className="task-item">
              <input type="checkbox" checked={task.completed} onChange={(e) => toggleCompleted(task.id, e.target.checked)} />
              <div className="task-body">
                <div className="task-main-text">
                  <span className={task.completed ? 'completed' : undefined}>{task.text}</span>
                  <div className="task-meta">{`${task.date || '日付未設定'} ${task.time || ''}`.trim()}</div>
                </div>
                <div className="task-tags">
                  <span className="category-chip" style={{ background: task.color || CATEGORY_COLOR[task.category] }}>{CATEGORY_LABEL[task.category] || 'その他'}</span>
                  <span className={`priority-badge priority-${task.priority}`}>{getPriorityLabel(task.priority)}</span>
                </div>
              </div>
              <button type="button" onClick={() => removeTask(task.id)}>削除</button>
            </li>
          ))
        )}
      </ul>

      <footer className="bottom-nav">
        <Link to="/" className="nav-item">ホーム</Link>
        <Link to="/task" className="nav-item active">タスク追加</Link>
        <Link to="/calendar" className="nav-item">カレンダー</Link>
      </footer>
    </div>
  )
}
