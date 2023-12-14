import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="*" element={<div>G9 App</div>} />
    </Routes>
  );
}

export default App;
