import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

// Prevent FOUC by adding loaded class after CSS is ready
const initializeApp = () => {
  // Ensure CSS is loaded before showing content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      root.classList.add('loaded');
      createRoot(root).render(<App />);
    });
  } else {
    // CSS already loaded, add class immediately
    root.classList.add('loaded');
    createRoot(root).render(<App />);
  }
};

initializeApp();
