import React        from 'react'
import App          from './App'
import {createRoot} from 'react-dom/client';

const container = document.querySelector('#root');
if (container) {
    const root = createRoot(container);
    root.render(<App/>);
}
