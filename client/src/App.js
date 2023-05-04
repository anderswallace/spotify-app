import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import {
  accessToken,
  logout,
  getCurrentUserProfile,
  getCurrentUserLikedSongs,
} from "./service";
import { catchErrors } from "./utils";
import { GlobalStyle } from "./styles";
import { Login } from "./pages";

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
  const [savedSongs, setSavedSongs] = useState(null);

  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };

    // retrieve user's saved songs
    // TODO: abstract this function outside of main page
    const fetchLikedSongs = async () => {
      var tracks = [];
      var { data } = await getCurrentUserLikedSongs();
      for (const items in data.items) {
        tracks.push(data.items[items].track);
      }
      var next = data.next;

      // if there is a next page, continue looping until no next page remains
      if (next) {
        while (next) {
          data = await getCurrentUserLikedSongs(next);
          for (const trackIndex in data.data.items) {
            tracks.push(data.data.items[trackIndex].track);
          }
          next = data.data.next;
        }
      }
      setSavedSongs(tracks);
    };

    catchErrors(fetchData());
    catchErrors(fetchLikedSongs());
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
              <Route
                path="/"
                element={
                  <>
                    <button onClick={logout}>Log Out</button>

                    {profile && (
                      <div>
                        <h1>{profile.display_name}</h1>
                        <p>{profile.followers.total} Followers</p>
                        {profile.images.length && profile.images[0].url && (
                          <img src={profile.images[0].url} alt="Avatar" />
                        )}
                      </div>
                    )}
                  </>
                }
              ></Route>
            </Routes>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
