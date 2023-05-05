import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { accessToken, logout, getCurrentUserProfile } from "./service";
import { catchErrors } from "./utils";
import { GlobalStyle } from "./styles";
import { Login } from "./pages";
import { Playlist } from "./pages";

// make page load at top when routing
function ScrollToTop() {
  const { pathName } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

  return null;
}

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <Login />
        ) : (
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/top-artists" element={<h1>Top Artists</h1>}></Route>
              <Route path="/top-tracks" element={<h1>Top Tracks</h1>}></Route>
              <Route path="/playlists/:id" element={<h1>Playlist</h1>}></Route>
              <Route path="/playlists" element={<h1>Playlists</h1>}></Route>
              <Route path="/" element={<Playlist />}></Route>
            </Routes>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
