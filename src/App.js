import './App.css';

function App() {
  const CLIENT_ID = "3cddff099f1e489ba2ff13aef52e4398";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

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
                  <a href="" className="login-btn" type="submit" variant="contained">Login with Spotify</a>
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
