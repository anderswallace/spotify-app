import axios from "axios";

// map for local storage keys
const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timeStamp: "spotify_token_timestamp",
};

// map for retrieving local storage values
const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timeStamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
};

// remove local storage items and log out user
export const logout = () => {
  // clear local storage items
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  // navigate to homepage
  window.location = window.location.origin;
};

// compute if accessToken has passed the allotted 3600 seconds and expired
const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;

  if (!accessToken || !timestamp) {
    return false;
  }

  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

const refreshToken = async () => {
  try {
    // logout if no refresh token
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error("No refresh token available");
      logout();
    }

    // call /refresh_token endpoint to refresh
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );

    // update local storage
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());

    // reload page to reflect local storage updates
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };

  const hasError = urlParams.get("error");

  // if theres an error or no token in local storage, refresh token
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  // if theres a valid token in local storage, use it
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // if there is valid token in url query params, then it is first time log in for user
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // store the params into local storage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }

    // record timestamp in local storage
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());

    // return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return false;
};

export const accessToken = getAccessToken();

// configurations for shortening api calls
axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

// get current user profile
export const getCurrentUserProfile = () => axios.get("/me");

// get current user's liked songs
export const getCurrentUserLikedSongs = (
  request = "/me/tracks?limit=50&offset=0"
) => axios.get(request);

// get audio features (tempo, key, etc.) for a list of comma separated track IDs
// NOTE: now not supported
export const getTracksAudioFeatures = (tracks) =>
  axios.get(`/audio-features?ids=${tracks}`);
