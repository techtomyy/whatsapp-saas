import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import ScanQrCode from './pages/ScanQRCode'
import './index.css'
import Features from './pages/Features'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/scanqrcode" element={<ScanQrCode />} />
         <Route path="/features" element={<Features />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
