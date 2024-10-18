import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Docs from './pages/Docs'
import Account from './pages/Account'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
