import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './component/login';
import Register from './component/register';
import Dashboard from './component/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/dashboard" element={ <Dashboard /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
