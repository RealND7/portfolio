import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/projects" element={<div>Projects Page</div>} />
        <Route path="/projects/:id" element={<div>Project Detail</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
