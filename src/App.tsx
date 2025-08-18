import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/useAuth";
import { BrowserRouter } from "react-router";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <div className="poppins-regular">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
