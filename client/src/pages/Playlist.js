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
  const [trackFeatures, setTrackFeatures] = useState(null);
  const [tracksBPM, setTracksBPM] = useState(null);

  // TODO: add limit to songs that are requested (maybe 500?)
  const fetchLikedSongs = async () => {
    var tracks = [];
    var trackIDs = [];
    var { data } = await getCurrentUserLikedSongs();
    for (const items in data.items) {
      tracks.push(data.items[items].track);
      trackIDs.push(data.items[items].track.id);
    }
    var next = data.next;

    // if there is a next page, continue looping until no next page remains
    if (next) {
      while (next) {
        data = await getCurrentUserLikedSongs(next);
        for (const trackIndex in data.data.items) {
          tracks.push(data.data.items[trackIndex].track);
          trackIDs.push(data.data.items[trackIndex].track.id);
        }
        next = data.data.next;
      }
    }
    setSavedSongs(tracks);
    setSavedTrackIDs(trackIDs);
  };

  // TODO: add bounds checking for when there are greater than 100 liked songs
  //       since there is no pagination for getting audio features
  const getTrackTempos = async () => {
    if (savedTrackIDs) {
      var trackTempos = [];
      var joinedTrackIDs = savedTrackIDs.join(",");
      var trackData = await getTracksAudioFeatures(joinedTrackIDs);
      var audioFeatures = trackData.data.audio_features;
    }
    setTrackFeatures(audioFeatures);
    for (const tracks in audioFeatures) {
      trackTempos.push(Math.round(audioFeatures[tracks].tempo));
    }
    setTracksBPM(trackTempos);
  };

  useEffect(() => {
    catchErrors(getTrackTempos());
  }, [savedTrackIDs]);

  return (
    <>
      <div>
        <button onClick={logout}>Log Out</button>
        <h1>PlaylistPage</h1>
        <AsyncButton onClick={catchErrors(fetchLikedSongs)}>
          Get Liked Songs
        </AsyncButton>
      </div>
    </>
  );
};

export default Playlists;
