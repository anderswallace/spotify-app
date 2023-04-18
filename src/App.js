import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const CLIENT_ID = "3cddff099f1e489ba2ff13aef52e4398";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = ["playlist-read-private", "playlist-read-collaborative"];
  const LOGIN_URL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;

  const [token, setToken] = useState("");
  const [code, setCode] = useState("");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // parse url for access token
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
    }
  }, []);

  // remove token from local storage and logout user
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <div className="container">
        <div id="login">
          <div className="header-section">
            <div className="row">
              <div className="col-12">
                <h1>Spotify Web App</h1>
                <h2>Generate Spotify Data</h2>
              </div>
              <div className="row flex-center">
                <div className="col-12 col-md-4">
                  {!token ? (
                    <a className="login-btn" type="submit" variant="contained">
                      Login with Spotify
                    </a>
                  ) : (
                    <button
                      className="login-btn"
                      variant="contained"
                      type="submit"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
