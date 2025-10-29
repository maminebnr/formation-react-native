import RootNavigation from './src/navigation/index';
import { AuthProvider } from './src/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}
