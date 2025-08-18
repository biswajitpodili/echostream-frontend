import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="poppins-regular">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
