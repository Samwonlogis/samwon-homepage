import { lazy } from 'react'
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
import Partnership from './pages/support/Partnership'
import { Notice, NoticePost } from './pages/support/Notice'
// 차주 포털·관리자·약관 화면은 따로 불러와 첫 화면 용량을 줄인다
const dp = () => import('./pages/driver/DriverPortal')
const lg = () => import('./pages/Legal')
const pick = (load, name) => lazy(() => load().then(m => ({ default: m[name] })))
const DriverLogin = pick(dp, 'DriverLogin'), DriverShell = pick(dp, 'DriverShell'), Statements = pick(dp, 'Statements'), StatementDetail = pick(dp, 'StatementDetail')
const Insurance = pick(dp, 'Insurance'), Board = pick(dp, 'Board'), Post = pick(dp, 'Post'), Guide = pick(dp, 'Guide'), ManualInvoice = pick(dp, 'ManualInvoice'), Checklist = pick(dp, 'Checklist')
const Admin = lazy(() => import('./pages/Admin'))
const Privacy = pick(lg, 'Privacy'), Terms = pick(lg, 'Terms'), NotFound = pick(lg, 'NotFound')

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
        <Route path="/contact/partnership" element={<Partnership />} />
        <Route path="/support/notice" element={<Notice />} />
        <Route path="/support/notice/:id" element={<NoticePost />} />
        <Route path="/support" element={<Navigate to="/support/notice" replace />} />
        <Route path="/driver" element={<DriverLogin />} />
        <Route path="/driver" element={<DriverShell />}>
          <Route path="statements" element={<Statements />} />
          <Route path="statements/:month" element={<StatementDetail />} />
          <Route path="statements/:month/invoice" element={<ManualInvoice />} />
          <Route path="insurance" element={<Insurance />} />
          <Route path="deductions" element={<Navigate to="/driver/insurance" replace />} />
          <Route path="checklist" element={<Checklist />} />
          <Route path="board" element={<Board />} />
          <Route path="board/:id" element={<Post />} />
          <Route path="guide" element={<Guide />} />
        </Route>
        <Route path="/admin" element={<Admin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
