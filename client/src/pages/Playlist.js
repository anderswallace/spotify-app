import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import { logout, getCurrentUserLikedSongs } from "../service";

const Playlists = () => {
  const [savedSongs, setSavedSongs] = useState(null);
  const [savedTrackIDs, setSavedTrackIDs] = useState(null);

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

  useEffect(() => {
    catchErrors(fetchLikedSongs());
  }, []);

  return (
    <>
      <div>
        <button onClick={logout}>Log Out</button>
        <h1>PlaylistPage</h1>
      </div>
    </>
  );
};

export default Playlists;
