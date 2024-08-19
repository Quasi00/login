import { AuthProvider } from "./contexts/authContext/authProvider";
import Site from "./contexts/site";

export default function App() {
  return (
    <AuthProvider>
      <Site/>
    </AuthProvider>
  );
}