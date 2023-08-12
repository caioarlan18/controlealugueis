import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/Homepage/Home';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
