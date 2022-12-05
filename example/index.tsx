import 'react-app-polyfill/ie11';
import * as React from 'react';
import {useRef} from 'react';
import { createRoot } from 'react-dom/client';
import Example1 from './Example1';
import Example2 from './Example2';
import Example3 from './Example3';
import Example4 from './Example4';
import Example5 from './Example5';

 export const App = () => {
    return (
        <>
            <Example1 />               
            <Example2 /> 
            <Example3 /> 
            <Example4 />
            <Example5 />
        </>        
    )
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
