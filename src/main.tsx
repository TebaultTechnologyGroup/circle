import "./amplifyConfig"; // must be first — configures Amplify before any other import
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
