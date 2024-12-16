import ReactDOM from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
);
