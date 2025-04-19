import './css/App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import LoginPage from "./components/LoginPage";
import EndpointRTC from "./components/EndpointRTC";
import Account from "./components/Account";

function App() {
  return (
    /* 
    Routes: 
    ----------
    /login
    /dashboard
    /endpoint-rtc
    /account
    ----------
    */
      <Router>
        <Routes>
          <Route exact path="/" element={<AuthenticatedRoute><Dashboard/></AuthenticatedRoute>}></Route>
          <Route exact path="/login" element={<LoginPage/>}></Route>
          <Route exact path="/dashboard" element={<AuthenticatedRoute><Dashboard/></AuthenticatedRoute>}></Route>
          <Route exact path="/endpoint-rtc" element={<AuthenticatedRoute><EndpointRTC/></AuthenticatedRoute>}></Route>
          <Route exact path="/account" element={<AuthenticatedRoute><Account/></AuthenticatedRoute>}></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;
