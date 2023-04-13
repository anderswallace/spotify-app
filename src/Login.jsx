

export const Login = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login pressed');
    }

    return (
        <div className="header-section">
          <div className="row">
            <div className="col-12">
              <h1>Spotify Web App</h1>
              <h2>Generate Spotify Data</h2>
            </div>
            <div className="col-12 col-md-4">
                <form onSubmit={handleSubmit}>
                    <button className="login-btn" type="submit" variant="contained">Login with Spotify</button>
            </form>
            </div>
            
          </div>
        </div>
        
    )
}