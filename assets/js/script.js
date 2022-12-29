let include_main = document.getElementById("include-main");
let include_mp3 = document.getElementById("include-mp3");

async function load_header() {
  let myPromise = new Promise(function (resolve) {
    let load = new XMLHttpRequest();
    load.open("GET", "header.html");

    load.onload = function () {
      if (load.status == 200) {
        resolve(load.response);
      } else {
        resolve("File not Found");
      }
    };

    load.send();
  });
  document.getElementById("include-header").innerHTML = await myPromise;
}

async function load_footer() {
  let myPromise = new Promise(function (resolve) {
    let load = new XMLHttpRequest();
    load.open("GET", "footer.html");

    load.onload = function () {
      if (load.status == 200) {
        resolve(load.response);
      } else {
        resolve("File not Found");
      }
    };

    load.send();
  });
  document.getElementById("include-footer").innerHTML = await myPromise;
}

async function load_player() {
  let myPromise = new Promise(function (resolve) {
    let load = new XMLHttpRequest();
    load.open("GET", "player.html");

    load.onload = function () {
      if (load.status == 200) {
        resolve(load.response);
      } else {
        resolve("File not Found");
      }
    };
    load.send();
  });
  document.getElementById("include-player").innerHTML = await myPromise;

  await all();
}

async function load_main() {
  let myPromise = new Promise(function (resolve) {
    let load = new XMLHttpRequest();
    load.open("GET", "main.html");

    load.onload = function () {
      if (load.status == 200) {
        resolve(load.response);
      } else {
        resolve("File not Found");
      }
    };
    load.send();
  });

  include_main.innerHTML = await myPromise;
}

async function load_mp3() {
  let myPromise = new Promise(function (resolve) {
    let load = new XMLHttpRequest();
    load.open("GET", "mp3.html");

    load.onload = function () {
      if (load.status == 200) {
        resolve(load.response);
      } else {
        resolve("File not Found");
      }
    };
    load.send();
  });
  include_mp3.innerHTML = await myPromise;

  await runMp3JS();
}

load_header();
load_footer();
load_main();
load_mp3();
load_player();

function all() {
  let songs = [
    {
      id: 1,
      image_cover: "pic1 (3).jpg",
      name: "ha mahdi",
      song: "ha mahdi.mp3",
      singer: "Basem Karbalaye",
    },
    {
      id: 2,
      image_cover: "pic1 (4).jpg",
      name: "Bi Gonah",
      song: "Alireza Ghorbani - Bi Gonah.mp3",
      singer: "Alireza Ghorbani",
    },
    {
      id: 3,
      image_cover: "pic1 (1).jpg",
      name: "Barzakhe Asheghi",
      song: "Hamed Homayoun - Barzakhe Asheghi.mp3",
      singer: "Hamed Homayoun",
    },
    {
      id: 4,
      image_cover: "pic1 (2).jpg",
      name: "Rose",
      song: "Masih - Rose.mp3",
      singer: "Masih",
    },
    {
      id: 5,
      image_cover: "pic1 (3).jpg",
      name: "ha mahdi",
      song: "ha mahdi.mp3",
      singer: "Basem Karbalaye",
    },
    {
      id: 6,
      image_cover: "pic1 (4).jpg",
      name: "Bi Gonah",
      song: "Alireza Ghorbani - Bi Gonah.mp3",
      singer: "Alireza Ghorbani",
    },
    {
      id: 7,
      image_cover: "pic1 (1).jpg",
      name: "Barzakhe Asheghi",
      song: "Hamed Homayoun - Barzakhe Asheghi.mp3",
      singer: "Hamed Homayoun",
    },
    {
      id: 8,
      image_cover: "pic1 (2).jpg",
      name: "Rose",
      song: "Masih - Rose.mp3",
      singer: "Masih",
    },
  ];

  let playlist = [];

  const audio = new Audio();

  let player = document.querySelector(".player");
  let btn_playlist = document.getElementById("btn-playlist");
  let playlist_onplay = document.querySelector(".playlist-onplay");
  let columns = document.getElementsByClassName("vertical"),
    audioInteval,
    analyser,
    buffer;

  let badge_time = document.getElementById("badge-time");
  let progress_play = document.querySelector(".progrees-time-play");
  let progress_body = document.querySelector(".progrees-time-onplay");

  const image_cover = document.querySelectorAll("#cover-music-onplay");
  const name_curr_music = document.querySelectorAll("#name-music-onplay");
  const singer_curr_music = document.querySelectorAll("#singer-music-onplay");
  const time_all_music = document.getElementById("all-time-music");
  const time_play = document.getElementById("time-play");

  let isPlaying,
    current_Time,
    songIndex = songs.length,
    playListIndex = 0,
    idOnlay;

  let prev = document.getElementById("prev-music-onplay");
  let next = document.getElementById("next-music-onplay");
  let play_pause = document.querySelectorAll(".play-music-onplay");

  progress_body?.addEventListener("click", setProgress);
  prev?.addEventListener("click", prevSong);
  next?.addEventListener("click", nextSong);
  audio?.addEventListener("ended", nextSong);

  // let repet = document.getElementById("repet-music-onplay"), switch_repet;
  // repet.addEventListener('click', repetSong);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////          control btn music      ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  play_pause.forEach((element) => {
    element.addEventListener("click", () => {
      isPlaying = player.classList.contains("play");
      isPlaying ? puaseSong() : playSong();
    });
  });

  // loadSong(songs[songIndex - 1]);

  function loadSong(song) {
    image_cover.forEach((element) => {
      element.src = "assets/file/cover/" + song.image_cover;
    });
    name_curr_music.forEach((element) => {
      element.innerText = song.name;
    });
    singer_curr_music.forEach((element) => {
      element.innerText = song.singer;
    });
    idOnlay = song.id;
    audio.src = "assets/file/music/" + song.song;
    audio.load();
  }

  function playSong() {
    player.classList.add("play");
    if (current_Time) {
      audio.currentTime = current_Time;
    }

    audio.addEventListener("timeupdate", updateProgress);

    isPlaying ? audio.play() : audio.play();

    for (let i = 0; i < play_pause.length; i++) {
      play_pause[i].classList.remove("fa-circle-play");
      play_pause[i].classList.add("fa-pause");
    }
  }

  function puaseSong() {
    player.classList.remove("play");
    clearInterval(audioInteval);

    audio.pause();

    for (let i = 0; i < play_pause.length; i++) {
      play_pause[i].classList.remove("fa-pause");
      play_pause[i].classList.add("fa-circle-play");
    }
  }

  function prevSong() {
    playListIndex--;
    if (playListIndex < 0) {
      playListIndex = playlist.length - 1;
    }
    loadSong(songs[songs.findIndex((x) => x.id == playlist[playListIndex])]);
    playSong();
  }

  function nextSong() {
    playListIndex++;

    if (playListIndex > playlist.length - 1) {
      playListIndex = 0;
    }
    loadSong(songs[songs.findIndex((x) => x.id == playlist[playListIndex])]);
    playSong();
  }

  function repetSong() {
    // switch(switch_repet){
    //     case "norepet":
    //         switch_repet = "one-repet";
    //         repet.classList.remove();
    //         repet.classList.add("fa fa-repeat");
    //     break;
    //     case "one-repet":
    //         switch_repet = "total-repet";
    //     break;
    //     case "total-repet":
    //         switch_repet = "norepet";
    //         repet.classList.add("fa fa-repeat");
    //     break;
    // }
  }

  function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress_play.style.width = `${progressPercent}%`;

    const badge = (currentTime / duration) * progress_body.offsetWidth;
    badge_time.style.transform = `translateX(${badge - 10}px)`;

    var cur_time = Math.floor(currentTime);
    if (cur_time < 59) {
      if (cur_time < 10) {
        time_play.innerText = "0:0" + cur_time;
      } else {
        time_play.innerText = "0:" + cur_time;
      }
    } else {
      var min = Math.floor(currentTime / 60);
      var secend = Math.floor(currentTime - min * 60);
      if (secend < 10) {
        secend = "0" + secend;
      }
      time_play.innerText = min + ":" + secend;
    }

    time_onplay = currentTime;

    var min_dur = Math.floor(duration % 60);
    if (min_dur < 10) {
      min_dur = "0" + min_dur;
    }
    time_all_music.innerText = Math.floor(duration / 60) + ":" + min_dur;
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////       control volume            ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let btn_volume = document.getElementById("btn-sound");
  let btnVolumeIcon = document.querySelector("#btn-sound i");
  let volumeControl = document.querySelector(".sound-control-progres");

  btn_volume?.addEventListener("mouseover", () => {
    volumeControl.style.display = "flex";
    btn_volume.style.zIndex = "1";
  });

  volumeControl?.addEventListener("mouseleave", () => {
    volumeControl.style.display = "none";
    btn_volume.style.zIndex = "3";
  });

  let inputRangeVolume = document.querySelector('input[type="range"]');
  inputRangeVolume?.addEventListener("input", (e) => {
    let target = e.target;
    if (e.target.type !== "range") {
      target = document.getElementById("rngVolume");
    }
    const min = target.min;
    const max = target.max;
    const val = target.value;

    target.style.backgroundSize = ((val - min) * 100) / (max - min) + "% 100%";

    if (val >= 0.6) {
      btnVolumeIcon.className = "";
      btnVolumeIcon.className = "fa fas fa-volume-high";
    } else if (0.3 >= val <= 0.7) {
      btnVolumeIcon.className = "";
      btnVolumeIcon.className = "fa fas fa-volume-low";
    } else if (val <= 0.1) {
      btnVolumeIcon.className = "";
      btnVolumeIcon.className = "fa fas fa-volume-mute";
    }

    audio.volume = val;
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////       board - item board        ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let board = document.querySelector(".board"),
    dots_board = document.querySelector(".dots-board"),
    item_board,
    item_dots;

  for (let i = 0; i < songIndex; i++) {
    var div = document.createElement("div");
    div.className = "item-board";
    const id = `${songs[i].id}`;
    div.id = id;

    let sample = `<img src="assets/file/cover/${songs[i].image_cover}" alt="img ${songs[i].image_cover}">
                  <div>
                    <p>${songs[i].name}</p>
                    <p>Track by ${songs[i].singer}</p>
                  </div>
                  <span></span>`;

    div.innerHTML = sample;
    board.appendChild(div);
    item_board = document.querySelectorAll(".item-board");

    var divDots = document.createElement("div");
    divDots.className = "item-dots";
    divDots.id = id;
    dots_board.appendChild(divDots);
    item_dots = document.querySelectorAll(".item-dots");
  }

  clickItemboard();
  function clickItemboard() {
    item_board.forEach((element) => {
      element.addEventListener("click", () => {
        addToPlayList(element.id);

        // include_main.style.display = "none";
        // include_mp3.style.display = "flex";

        // var stateObj = { foo: "bar" };
        // history.pushState(stateObj, "mp3", "mp3.html");
      });
    });
  }

  clickItemDot();
  let centerBoard = board.offsetWidth,
    curerentSilde = 4;
  function clickItemDot() {
    item_dots.forEach((element) => {
      element.addEventListener("click", () => {
        const witdthElement = item_board[element.id].offsetWidth;

        if (element.id >= 7) {
          var pos = element.id * witdthElement;
        } else {
          var pos = (element.id - 2) * witdthElement;
        }

        if (element.id != curerentSilde) {

          var id = null;
          clearInterval(id);
          id = setInterval(frame, 10);

          function frame() {
            if (curerentSilde > element.id) {
              if (centerBoard >= pos) {
                centerBoard -= 15;
              } else {
                curerentSilde = element.id;
                clearInterval(id);
              }
            } else if (curerentSilde < element.id) {
              if (centerBoard <= pos) {
                centerBoard += 15;
              } else {
                curerentSilde = element.id;
                clearInterval(id);
              }
            }

            // console.log("item click=>" + element.id);
            // console.log("centerBoard=>" + centerBoard);
            // console.log("curerentSilde 2 =>" + curerentSilde);

            board.scrollTo(centerBoard, 0);
          }
        }
        
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////             playlist            ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  btn_playlist?.addEventListener("click", (e) => {
    playlist_onplay.style.display == "none"
      ? (playlist_onplay.style.display = "flex")
      : (playlist_onplay.style.display = "none");
  });

  let list_music_onplay = document.querySelector(".list-music-onplay"),
    item_playlist,
    item_playlist_div,
    btn_play,
    clearToListItem;

  function addToPlayList(id) {
    loadSong(songs[songs.findIndex((x) => x.id == id)]);

    playSong();

    const found = playlist.find((element) => element == id);

    if (!found) {
      playlist.push(id);
      updatePlaylist();
    }
  }

  function updatePlaylist() {
    if (list_music_onplay.hasChildNodes) {
      list_music_onplay.innerHTML = "";
    }

    for (let i = 0; i < playlist.length; i++) {
      var div = document.createElement("div");
      div.className = "item-playlist-onplay";
      div.id = `${playlist[i]}`;
      var indexx = songs.findIndex((x) => x.id == playlist[i]);

      let sample = `<div id = ${playlist[i]}>
                        <img src="assets/file/cover/${songs[indexx].image_cover}" alt="img cover">
                        <div>
                            <p>${songs[indexx].name}</p>
                            <p>${songs[indexx].singer}</p>
                        </div>
                  </div>
                  <div>
                  <i class="fa fa-trash title-2 btn-item" id=${playlist[i]}></i>
                  <i class="fa fa-circle-play title-2 btn-item" id=${playlist[i]}></i>
                  </div>`;

      div.innerHTML = sample;
      list_music_onplay.appendChild(div);

      item_playlist = document.querySelectorAll(".item-playlist-onplay");
      item_playlist_div = document.querySelectorAll(
        ".item-playlist-onplay> div"
      );
      clearToListItem = document.querySelectorAll(".btn-item:nth-child(1)");
      btn_play = document.querySelectorAll(".btn-item:nth-child(2)");

      fun_item_playlist();
      fun_clearToListItem();

      // for (let i = 0; i < playlist.length; i++) {
      //     console.log("for=>"+playlist[i]);
      // }
    }
  }

  function fun_item_playlist() {
    item_playlist_div.forEach((element) => {
      element.addEventListener("click", () => {
        console.log(element.id);
        loadSong(songs[songs.findIndex((x) => x.id == element.id)]);
        playSong();
      });
    });
    btn_play.forEach((element) => {
      element.addEventListener("click", () => {
        console.log(element.id);
        loadSong(songs[songs.findIndex((x) => x.id == element.id)]);
        playSong();
      });
    });
  }

  function fun_clearToListItem() {
    clearToListItem.forEach((element) => {
      element.addEventListener("click", () => {
        if (element.id != idOnlay) {
          const index = playlist.indexOf(element.id);
          if (index > -1) {
            playlist.splice(index, 1);
          }
          updatePlaylist();
        }
      });
    });
  }
}

function runMp3JS() {
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////           box Download          ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let boxDownload = document.querySelector(".box-download");
  let btnDownload = document.getElementById("btn-download");
  btnDownload.addEventListener("click", () => {
    boxDownload.style.display = "flex";
  });

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////           detials music         ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let btnDetails = document.querySelector(".btn-details");
  let bodyDetails = document.querySelector(".body-details");
  btnDetails.addEventListener("click", () => {
    if (!bodyDetails.classList.contains("show")) {
      bodyDetails.classList.add("show");
      bodyDetails.style.padding = "1.5rem 2rem";

      let count = 0,
        myInterval;

      myInterval = setInterval(() => {
        if (count >= 100) {
          clearInterval(myInterval);
        } else {
          count += 10;
          bodyDetails.style.height = `${count}%`;
          console.log(count);
        }
      }, 25);
    } else {
      bodyDetails.classList.remove("show");
      bodyDetails.style.height = "0px";
      bodyDetails.style.padding = "0";
      clearInterval(myInterval);
      count = 0;
    }
  });
}
