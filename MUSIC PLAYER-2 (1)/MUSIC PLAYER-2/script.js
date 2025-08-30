const songs = [
  { title: "Morning Light", artist: "Roa Music", src: "songs/morning-light.mp3", cover: "covers/cover1.png" },
  { title: "Journey", artist: "Ikson", src: "songs/journey.mp3", cover: "covers/cover2.png" },
  { title: "Skyline", artist: "Luke Bergs", src: "songs/skyline.mp3", cover: "covers/cover3.png" },
  { title: "Dreams", artist: "Bensound", src: "songs/dreams.mp3", cover: "covers/cover4.png" }
];

let currentSong = 0;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.src;
  cover.src = song.cover;
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸️";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶️";
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(songs[currentSong]);
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(songs[currentSong]);
  playSong();
});

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value * audio.duration) / 100;
});

loadSong(songs[currentSong]);
