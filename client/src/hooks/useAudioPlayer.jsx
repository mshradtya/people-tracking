import { useState, useEffect } from "react";

const useAudioPlayer = (audioFile, eventTrigger) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    const newAudioElement = new Audio(audioFile);
    setAudioElement(newAudioElement);

    return () => {
      newAudioElement.pause();
    };
  }, [audioFile]);

  useEffect(() => {
    if (eventTrigger) {
      setIsPlaying(true);
      audioElement.loop = true;
      audioElement.play();
    } else {
      setIsPlaying(false);
      audioElement?.pause();
    }
  }, [eventTrigger, audioElement]);

  return isPlaying;
};

export default useAudioPlayer;
