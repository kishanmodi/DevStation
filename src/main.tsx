import {createRoot} from 'react-dom/client';

console.log("JS STARTING");
document.body.style.backgroundColor = "blue";

const root = createRoot(document.getElementById('root')!);
root.render(
  <div style={{ background: 'green', color: 'white', padding: '50px' }}>
    <h1>REACT IS RENDERING</h1>
  </div>
);
