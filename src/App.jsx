import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Opportunities from './pages/Opportunities'
import Scanner from './pages/Scanner'
import Projects from './pages/Projects'
import Plugins from './pages/Plugins'
import Landing from './pages/Landing'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/dashboard"      element={<Dashboard />} />
            <Route path="/opportunities"  element={<Opportunities />} />
            <Route path="/scanner"        element={<Scanner />} />
            <Route path="/projects"       element={<Projects />} />
            <Route path="/plugins"        element={<Plugins />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}
