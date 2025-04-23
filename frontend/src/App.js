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
    /dashboard/endpoints
    /dashboard/endpoints/processes
    /dashboard/endpoints/network-connections
    /dashboard/endpoints/files
    /dashboard/alerts
    /dashboard/ai-reports
    /dashboard/admin/prowl-users
    /dashboard/education/articles
    /dashboard/education/articles/:slug
    /endpoint-rtc
    /account
    ----------
    */
      <Router>
        <Routes>
          <Route exact path="/" element={<AuthenticatedRoute><Dashboard screen="central_dashboard"/></AuthenticatedRoute>}></Route>
          <Route exact path="/login" element={<LoginPage/>}></Route>
          <Route exact path="/dashboard" element={<AuthenticatedRoute><Dashboard screen="central_dashboard"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/endpoints" element={<AuthenticatedRoute><Dashboard screen="endpoints"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/endpoints/processes" element={<AuthenticatedRoute><Dashboard screen="processes"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/endpoints/network-connections" element={<AuthenticatedRoute><Dashboard screen="network_connections"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/endpoints/files" element={<AuthenticatedRoute><Dashboard screen="files"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/alerts" element={<AuthenticatedRoute><Dashboard screen="alerts"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/ai-reports" element={<AuthenticatedRoute><Dashboard screen="reports"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/admin/prowl-users" element={<AuthenticatedRoute><Dashboard screen="prowl_users"/></AuthenticatedRoute>}></Route>
          <Route exact path="/dashboard/education/articles" element={<AuthenticatedRoute><Dashboard screen="education_hub"/></AuthenticatedRoute>}></Route>
          <Route path="/dashboard/education/articles/:slug" element={<AuthenticatedRoute><Dashboard screen="render_article_slug"/></AuthenticatedRoute>}></Route>
          <Route exact path="/endpoint-rtc" element={<AuthenticatedRoute><EndpointRTC/></AuthenticatedRoute>}></Route>
          <Route exact path="/account" element={<AuthenticatedRoute><Account/></AuthenticatedRoute>}></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;
