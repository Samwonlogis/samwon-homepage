import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Intro from './pages/company/Intro'
import History from './pages/company/History'
import Status from './pages/company/Status'
import Offices from './pages/company/Offices'
import Vision from './pages/company/Vision'
import BusinessIntro from './pages/business/BusinessIntro'
import BusinessPage from './pages/business/BusinessPage'
import Talent from './pages/recruitment/Talent'
import DriverJobs from './pages/recruitment/DriverJobs'
import Contact from './pages/Contact'
import Driver from './pages/Driver'
import Admin from './pages/Admin'
import { Privacy, Terms, NotFound } from './pages/Legal'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<Intro />} />
        <Route path="/company/intro" element={<Intro />} />
        <Route path="/company/history" element={<History />} />
        <Route path="/company/status" element={<Status />} />
        <Route path="/company/offices" element={<Offices />} />
        <Route path="/company/vision" element={<Vision />} />
        <Route path="/company/location" element={<Navigate to="/company/offices#location" replace />} />
        <Route path="/business" element={<BusinessIntro />} />
        <Route path="/business/:id" element={<BusinessPage />} />
        <Route path="/recruitment" element={<Talent />} />
        <Route path="/recruitment/talent" element={<Talent />} />
        <Route path="/recruitment/jobs" element={<DriverJobs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
