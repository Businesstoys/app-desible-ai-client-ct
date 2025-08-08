import React from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const AudioPlayer = ({ source, title }) => {
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    const player = new Plyr('#player', {
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "download",
        "settings",
      ],
      settings: ["speed", "quality"],
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [source]);

  return (
    <div className="audio-player-container">
      <audio
        id="player"
        className="plyr-react plyr"
        preload="auto"
      >
        <source src={source} type="audio/mp3" />
        <source src={source} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Alternative: Custom download button */}
      {/* 
      <div className="custom-download">
        <a 
          href={source} 
          download={title || "audio-file"}
          className="download-btn"
        >
          Download Audio
        </a>
      </div>
      */}
    </div>
  );
};

export default AudioPlayer;