import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TaskPage from './components/TaskPage'
import HomePage from './components/HomePage'
import CalendarPage from './components/CalendarPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/task" element={<TaskPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
