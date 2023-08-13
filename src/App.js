import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/Homepage/Home';
import { AddHome } from './components/adicionar casas/AddHome';
import { SeeHome } from './components/ver casas/SeeHome';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addhome' element={<AddHome />} />
          <Route path='/seehome' element={<SeeHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
