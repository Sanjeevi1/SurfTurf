import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Turf from './pages/Turf'
import TurfDetail from './pages/TurfDetail'
import Book from './pages/Book'
import Bookings from './pages/Bookings'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SavedTurfs from './pages/SavedTurfs'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <Router>
      <div className="bg-white transition-all ease-in-out relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/turf" element={<Turf />} />
          <Route path="/turf/:id" element={<TurfDetail />} />
          <Route path="/book" element={<Book />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/saved" element={<SavedTurfs />} />
        </Routes>
        
        {/* Chatbot container */}
        <div className="fixed bottom-4 right-4 z-50">
          <Toaster
            position="top-right"
            reverseOrder={false}
          />
          <Chatbot />
        </div>
      </div>
    </Router>
  )
}

export default App