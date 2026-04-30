const keyStrokesSounds = [
  "/keystroke1.mp3",
  "/keystroke2.mp3",
  "/keystroke3.mp3",
  "/keystroke4.mp3",
];

function useKeyboardSound() {
  const playRandomStrokeSound = () => {
    const randomPath =
      keyStrokesSounds[Math.floor(Math.random() * keyStrokesSounds.length)];

    const audio = new Audio(randomPath);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  return { playRandomStrokeSound };
}

export default useKeyboardSound;