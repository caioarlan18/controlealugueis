import './App.css';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/Homepage/Home';
import { AddHome } from './components/adicionar casas/AddHome';
import { SeeHome } from './components/ver casas/SeeHome';
import { UpdateHome } from './components/atualizar dados/UpdateHome';
import { GeneralHome } from './components/dados gerais/GeneralHome';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addhome' element={<AddHome />} />
          <Route path='/seehome' element={<SeeHome />} />
          <Route path='/updatehome/:id' element={<UpdateHome />} />
          <Route path='/generalhome/:id' element={<GeneralHome />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
