let cards = document.querySelectorAll(".card");
let expandedCard = document.querySelector(".expanded-card");
let popup = document.querySelector(".pop-up");
let closeAlbum = document.querySelector(".close-album");
let expandedCardInfo = document.querySelector(".expandedcard-info");
let songUL = document.querySelector(".song-list");
let songs = [];// array that carry songs 

// track buttons 
let currentSongIndex = 0
let Audioplayer = document.getElementById("player")
let playpause = document.querySelector(".play")
let nextBtn = document.querySelector(".next")
let prevBtn = document.querySelector(".prev")

let songName = document.querySelector(".song-name")
let currTime = document.querySelector(".curr-time")
let duration = document.querySelector(".duration")
let seekCircle = document.querySelector(".seek-box")
// Fetch songs from folder with async/await + error handling
async function getSongs(folder) {
  try {
    songUL.innerHTML = "<li>Loading...</li>"; // show loading status

    const res = await fetch("songs.json"); // adjust path if needed
    const data = await res.json();

    if (!data[folder]) {
      throw new Error("Folder not found");
    }

    // Songs are now full paths like "songs/funk/track.m4a"
    const fetchedSongs = data[folder];

    if (fetchedSongs.length === 0) {
      songUL.innerHTML = "<li>No songs found in this album.</li>";
      return [];
    }

    return fetchedSongs;

  } catch (error) {
    console.error("Failed to fetch songs:", error);
    songUL.innerHTML = "<li>Failed to load songs. Please try again.</li>";
    return [];
  }
}

// loading song into album
function renderSongs(songs) {
  songUL.innerHTML = "";
  songs.forEach((songurl, index) => {
    const li = document.createElement("li");
    li.innerText = decodeURI(songurl.split("songs/")[1].replaceAll("%20", " ").replace(".m4a", " ")).split("/")[1];
    li.dataset.index = index
    li.addEventListener("click", () => {
      currentSongIndex = parseInt(li.dataset.index)
      playsong(currentSongIndex)
    })
    songUL.appendChild(li);
  });
}
// function to play song
function playsong(index) {
  Audioplayer.src = songs[index]
  Audioplayer.play()
  playpause.src = "svgs/pause.svg"
  songName.textContent = decodeURI(songs[index].split("songs/")[1].replaceAll("%20", " ").replace(".m4a", " ")).split("/")[1];//displaying song name

  Audioplayer.addEventListener("timeupdate", () => {
    currTime.innerHTML = formatTime(parseInt(Audioplayer.currentTime))
    if (isNaN(Audioplayer.duration)) {
      duration.innerHTML = "00:00"
    } else {
      duration.innerHTML = formatTime(parseInt(Audioplayer.duration))
    }
    seekCircle.style.left = Audioplayer.currentTime / Audioplayer.duration * 100 + "%";
  })
}
// formatting song time and duration in timer format (00:00)
function formatTime(seconds) {
  let min = Math.floor(seconds / 60)
  let sec = Math.floor(seconds % 60)
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}
// Opening card and get songs from song-album
async function openCard(card) {
  expandedCard.classList.replace("expanded-card", "invoke-expanded-card");
  popup.classList.remove("disable");

  // updating image of card
  const currentImg = card.querySelector("img").currentSrc;
  expandedCard.querySelectorAll(".songlist-img").forEach(img => img.src = currentImg);
  // updating info of card
  const albumName = card.querySelector("h3").innerHTML;
  const authorName = card.querySelector("h6").innerHTML;
  expandedCardInfo.querySelector("h3").innerHTML = albumName;
  expandedCardInfo.querySelector("h6").innerHTML = authorName;
  const folder = card.dataset.folder;
  songs = await getSongs(folder);
  renderSongs(songs);
}

// Attach event to every single card
cards.forEach(card => {
  card.addEventListener("click", () => openCard(card));
});

// close album
closeAlbum.addEventListener("click", () => {
  expandedCard.classList.replace("invoke-expanded-card", "expanded-card");
  popup.classList.add("disable");
});

// function to play,prev,next music

// previous btn
prevBtn.addEventListener("click", () => {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  playsong(currentSongIndex)
});
// next btn
nextBtn.addEventListener("click", () => {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  playsong(currentSongIndex)
});
// play pause song
playpause.addEventListener("click", () => {
  if (Audioplayer.paused) {
    Audioplayer.play()
    playpause.src = "svgs/pause.svg"
  }
  else {
    Audioplayer.pause()
    playpause.src = "svgs/play.svg"
  }
})

let playAlbumBtn = document.querySelector(".play-album-btn")
playAlbumBtn.addEventListener("click", () => {
  currentSongIndex = 0;
  playsong(currentSongIndex)
})
// manupulating audio by seekbar
let slider = document.querySelector(".seek-line")
slider.addEventListener("click", e => {
  let percentage = (parseInt(e.offsetX) / parseInt(e.target.getBoundingClientRect().width)) * 100
  seekCircle.style.left = percentage + "%";
  Audioplayer.currentTime = (parseInt(e.offsetX) / parseInt(e.target.getBoundingClientRect().width) * Audioplayer.duration)
})
let currVolume = 100
// mute and unmute
document.querySelector(".mute").addEventListener("click", () => {
  if (Audioplayer.volume == 1) {
    document.querySelector(".muteUnmute").src = "svgs/mute.svg"
    Audioplayer.volume = 0
    currVolume = 0
  }
  else {
    Audioplayer.volume = 1
    currVolume = 100
    document.querySelector(".muteUnmute").src = "svgs/unmute.svg"
  }
})
// increase volume
document.querySelector(".inc-vol").addEventListener("click", () => {
  if (Audioplayer.volume != 1) {
    Audioplayer.volume += 0.1
    currVolume += 10
  }
  else {
    Audioplayer.volume = 1
    currVolume = 100
  }
})

// decrease volume
document.querySelector(".dec-vol").addEventListener("click", () => {
  if (Audioplayer.volume != 0) {
    Audioplayer.volume -= 0.1
    currVolume -= 10
  }
  else {
    Audioplayer.volume = 0
    currVolume = 0
  }
})
document.querySelector(".volume").addEventListener("click", () => {
  if (currVolume == 0) {
    document.querySelector(".muteUnmute").src = "svgs/mute.svg"
  }
  else {
    document.querySelector(".muteUnmute").src = "svgs/unmute.svg"
  }
})

document.querySelector(".close-premium").addEventListener("click", () => {
  document.querySelector(".premium").style.display = "none"
})
document.querySelector(".volume").addEventListener("click", () => {
  document.querySelector(".vol-per").innerHTML = currVolume + "%"
})
document.querySelector(".more").addEventListener("click", () => {
  // body-left
  document.querySelector(".sidebar").style.visibility = "visible"
  document.querySelector(".sidebar").style.opacity = "1"
})
document.querySelector(".close-sidebar").addEventListener("click", () => {
  document.querySelector(".sidebar").style.visibility = "hidden"
  document.querySelector(".sidebar").style.opacity = "0"
})
