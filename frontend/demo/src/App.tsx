import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './pages/Home'
import ChatPage from './pages/Chat';
import NotFoundPage from './pages/404';
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/groups/:groupId" element={<ChatPage />} />
        <Route path="/groups/:groupId/404" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
