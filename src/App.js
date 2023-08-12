import logo from './logo.svg';
import styles from './App.module.css';
import HomePage from "./pages/HomePage"
import Login from "./pages/LoginPage"
import SignUp from "./pages/SignUpPage"
import HomeDashboard from './pages/HomeDashboardPage';

function App() {
  return (
    <div classname={styles.app}>
      <HomeDashboard />
    </div>
  );
}

export default App;
