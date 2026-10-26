import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { ContentProvider } from './context/ContentContext'
import './styles.css'

// 미리보기(단일 파일) 빌드에서는 HashRouter, 배포 빌드에서는 BrowserRouter
const Router = import.meta.env.VITE_PREVIEW ? HashRouter : BrowserRouter
const base = import.meta.env.VITE_PREVIEW ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContentProvider>
      <Router basename={base}><App /></Router>
    </ContentProvider>
  </React.StrictMode>
)
