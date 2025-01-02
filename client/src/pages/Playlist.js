import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import {
  logout,
  getCurrentUserLikedSongs,
  getTracksAudioFeatures,
} from "../service";
import { AsyncButton } from "../Components";

const Playlists = () => {
  const [savedSongs, setSavedSongs] = useState(null);
  const [savedTrackIDs, setSavedTrackIDs] = useState(null);
  const [filteredTracks, setFilteredTracks] = useState(null);
  const [filteredTempos, setFilteredTempos] = useState(null);
  const [userBPM, setUserBPM] = useState("");

  const fetchLikedSongs = async () => {
    var tracks = [];
    var trackIDs = [];
    var { data } = await getCurrentUserLikedSongs();
    for (const items in data.items) {
      tracks.push(data.items[items].track);
      trackIDs.push(data.items[items].track.id);
    }
    var next = data.next;
    var requestedSongs = 50;

    // if there is a next page, continue looping until no next page remains
    // or until 500 songs have been requested
    if (next) {
      while (next && requestedSongs < 500) {
        data = await getCurrentUserLikedSongs(next);
        for (const trackIndex in data.data.items) {
          tracks.push(data.data.items[trackIndex].track);
          trackIDs.push(data.data.items[trackIndex].track.id);
        }
        next = data.data.next;
        requestedSongs += 50;
      }
    }
    setSavedSongs(tracks);
    setSavedTrackIDs(trackIDs);
    console.log(tracks);
  };

  // TODO: add bounds checking for when there are greater than 100 liked songs
  //       since there is no pagination for getting audio features
  const getTrackTempos = async () => {
    if (savedTrackIDs) {
      var trackTempos = [];
      var joinedTrackIDs = savedTrackIDs.join(",");
      var trackData = await getTracksAudioFeatures(joinedTrackIDs);
      var audioFeatures = trackData.data.audio_features;

      for (const tracks in audioFeatures) {
        trackTempos.push(Math.round(audioFeatures[tracks].tempo));
      }

      // filter the tracks out by BPMs retrieved
      filterTracks(trackTempos);
    }
  };

  // filter out songs that don't match user provided BPM
  const filterTracks = (trackTempos) => {
    // deep copy to keep state unchanged
    var tracksData = JSON.parse(JSON.stringify(savedSongs));
    var targetTempo = userBPM;
    var filteredSongs = [];
    var filteredBPM = [];

    for (const track in trackTempos) {
      if (trackTempos[track] == targetTempo) {
        filteredSongs.push(tracksData[track]);
        filteredBPM.push(trackTempos[track]);
      }
    }
    setFilteredTracks(filteredSongs);
    setFilteredTempos(filteredBPM);
  };

  //useEffect(() => {
    //catchErrors(getTrackTempos());
  //}, [savedTrackIDs]);

  function handleBPMSubmit(e) {
    e.preventDefault();
    if (userBPM) {
      catchErrors(fetchLikedSongs());
    }
  }

  const handleChange = (e) => {
    // filter out non-numerical input
    const value = e.target.value.replace(/\D/g, "");
    setUserBPM(value);
  };

  return (
    <>
      <div>
        <button onClick={logout}>Log Out</button>
        <h1>PlaylistPage</h1>
        <form onSubmit={handleBPMSubmit}>
          <label>
            Input Tempo:
            <input value={userBPM} onChange={handleChange} />
          </label>
          <button type="submit">Get Liked Songs</button>
        </form>
      </div>
    </>
  );
};

export default Playlists;
