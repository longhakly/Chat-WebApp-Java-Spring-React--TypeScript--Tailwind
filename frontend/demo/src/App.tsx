import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './pages/Home'
import ChatPage from './pages/Chat';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/groups/:groupId" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
