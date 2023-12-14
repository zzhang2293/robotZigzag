import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/login/Login";
import { UserDashboard } from "./pages/userdashboard/UserDashboard";
import { TestMode } from "./pages/test_mode/TestMode";
import { BaseOutlet } from "./pages/userdashboard/components/BaseOutlet";
import { Settings } from "./pages/settings_page/Settings";
import { TournamentMode } from "./pages/tournament_mode/TournamentMode";
import { ManualMode } from "./pages/manual_mode/ManualMode";
import AuthenticationProvider from "./api/AuthenticationProvider";

// React routing framework TODO:
const App = () => {
  return (
    <AuthenticationProvider>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="user" element={<UserDashboard />}>
          <Route path="dashboard" element={<BaseOutlet />} />
          <Route path="practice" element={<ManualMode />} />
          <Route path="tournamentmode" element={<TournamentMode />} />
          <Route path="test" element={<TestMode />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </AuthenticationProvider>
  );
};

export default App;
