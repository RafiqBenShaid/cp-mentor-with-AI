import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import SkillGraph from './pages/SkillGraph'
import Goals from './pages/Goals'
import Recommend from './pages/Recommend'
import Contests from './pages/Contests'
import MockContest from './pages/MockContest'
import Revision from './pages/Revision'
import Roadmap from './pages/Roadmap'
import Progress from './pages/Progress'
import Resume from './pages/Resume'
import Community from './pages/Community'
import Mentor from './pages/Mentor'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Home from './pages/Home'

export default function App() {
  const darkMode = useStore((s) => s.darkMode)
  const sessionUserId = useStore((s) => s.sessionUserId)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  if (!sessionUserId) {
    return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    )
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/skill-graph" element={<SkillGraph />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/mock-contest" element={<MockContest />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/community" element={<Community />} />
          <Route path="/mentor" element={<Mentor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
