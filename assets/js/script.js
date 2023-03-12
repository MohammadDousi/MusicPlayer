let include_main = document.getElementById("include-main");
let include_mp3 = document.getElementById("include-mp3");

async function load_header() {
  const response = await fetch("header.html");
  const data = await response.text();

  let include_header = document.querySelectorAll(".include-header");
  if (response.status == 200) {
    for (var i = 0; i < include_header.length; i++) {
      include_header[i].innerHTML = data;
    }
  } else {
    console.log("File not Found");
  }
}

async function load_footer() {
  const response = await fetch("footer.html");
  const data = await response.text();

  if (response.status == 200) {
    document.getElementById("include-footer").innerHTML = data;
  } else {
    console.log("File not Found");
  }
}

async function load_main() {
  const response = await fetch("main.html");
  const data = await response.text();

  if (response.status == 200) {
    include_main.innerHTML = data;
  } else {
    console.log("File not Found");
  }
}

async function load_mp3() {
  const response = await fetch("mp3.html");
  const data = await response.text();

  if (response.status == 200) {
    include_mp3.innerHTML = data;
  } else {
    console.log("File not Found");
  }
  await load_header();
  await loadJS("assets/js/mp3.js");
}

async function load_player() {
  const response = await fetch("player.html");
  const data = await response.text();

  if (response.status == 200) {
    document.getElementById("include-player").innerHTML = data;
  } else {
    console.log("File not Found");
  }

  await all();
}

load_main();
load_header();
load_footer();
load_player();
load_mp3();

function loadJS(address) {
  let scriptEle = document.createElement("script");
  scriptEle.setAttribute("src", address);
  scriptEle.setAttribute("type", "module");
  document.body.appendChild(scriptEle);
}


function all() {
  let isPlaying,
    current_Time,
    playListIndex = 0,
    idOnplay;

  let songs = [
    {
      id: 1,
      cover: "pic1 (3).jpg",
      name: "ha mahdi",
      song: "ha mahdi.mp3",
      singer: "Basem Karbalaye",
    },
    {
      id: 2,
      cover: "pic1 (4).jpg",
      name: "Bi Gonah",
      song: "Alireza Ghorbani - Bi Gonah.mp3",
      singer: "Alireza Ghorbani",
    },
    {
      id: 3,
      cover: "pic1 (1).jpg",
      name: "Barzakhe Asheghi",
      song: "Hamed Homayoun - Barzakhe Asheghi.mp3",
      singer: "Hamed Homayoun",
    },
    {
      id: 4,
      cover: "pic1 (2).jpg",
      name: "Rose",
      song: "Masih - Rose.mp3",
      singer: "Masih",
    },
    {
      id: 5,
      cover: "pic1 (3).jpg",
      name: "ha mahdi",
      song: "ha mahdi.mp3",
      singer: "Basem Karbalaye",
    },
    {
      id: 6,
      cover: "pic1 (4).jpg",
      name: "Bi Gonah",
      song: "Alireza Ghorbani - Bi Gonah.mp3",
      singer: "Alireza Ghorbani",
    },
    {
      id: 7,
      cover: "pic1 (1).jpg",
      name: "Barzakhe Asheghi",
      song: "Hamed Homayoun - Barzakhe Asheghi.mp3",
      singer: "Hamed Homayoun",
    },
    {
      id: 8,
      cover: "pic1 (2).jpg",
      name: "Rose",
      song: "Masih - Rose.mp3",
      singer: "Masih",
    },
  ];

  let url = "assets/php/function.php",
    formData = new FormData();

  // id , name , cover , singer
  let loadSongFromArray = "",
    playlist = [],
    newsetArray = [];

  const audio = new Audio();

  let player = document.querySelector(".player");
  let btn_playlist = document.getElementById("btn-playlist");
  btn_playlist?.addEventListener("click", ClosePlayList);
  let playlist_onplay = document.querySelector(".playlist-onplay");

  let badge_time = document.getElementById("badge-time");
  let progress_play = document.querySelector(".progrees-time-play");
  let progress_body = document.querySelector(".progrees-time-onplay");

  const cover = document.querySelector("#cover-music-onplay");
  const name_curr_music = document.querySelector("#name-music-onplay");
  const singer_curr_music = document.querySelector("#singer-music-onplay");
  const time_all_music = document.getElementById("all-time-music");
  const time_play = document.getElementById("time-play");

  const btnClosePlayList = document.querySelector(".fa-close");
  btnClosePlayList?.addEventListener("click", ClosePlayList);

  const btnRepeat = document.querySelector(".fa-repeat");
  btnRepeat?.addEventListener("click", repeatSong);
  let SwitchRepeat = 1,
    playRepeat = 0;

  let prev = document.getElementById("prev-music-onplay");
  let next = document.getElementById("next-music-onplay");
  let play_pause = document.querySelector(".play-music-onplay");

  progress_body?.addEventListener("click", setProgress);
  prev?.addEventListener("click", prevSong);
  next?.addEventListener("click", nextSong);
  audio?.addEventListener("ended", nextSong);

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////          control btn music      ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  play_pause?.addEventListener("click", () => {
    isPlaying = player.classList.contains("play");
    isPlaying ? puaseSong() : playSong();
  });

  // loadSong(songs[songIndex - 1]);

  function loadSong(song) {

    cover.src = "assets/file/cover/" + song.cover;
    name_curr_music.innerText = song.name;
    singer_curr_music.innerText = song.singer;

    idOnplay = song.id;
    audio.src = "assets/file/song/" + song.name + ".mp3";
    audio.load();
  }

  function playSong() {
    player.classList.add("play");

    if (current_Time) {
      audio.currentTime = current_Time;
    }

    audio.addEventListener("timeupdate", updateProgress);

    isPlaying ? audio.play() : audio.play();

    play_pause.classList.remove("fa-circle-play");
    play_pause.classList.add("fa-pause");
  }

  function puaseSong() {
    player.classList.remove("play");

    audio.pause();

    play_pause.classList.remove("fa-pause");
    play_pause.classList.add("fa-circle-play");
  }

  function prevSong() {
    playListIndex--;
    if (playListIndex < 0) {
      playListIndex = playlist.length - 1;
    }

    switch (loadSongFromArray) {
      case "newset":
        loadSong(
          newsetArray[
            newsetArray.findIndex((x) => x.id == playlist[playListIndex].id)
          ]
        );
        break;
    }

    playSong();
  }

  function nextSong() {
    switch (SwitchRepeat) {
      case 1:
        playListIndex++;
        if (playListIndex > playlist.length) {
          playListIndex = 0;
        }

        console.log(playListIndex);

        break;
      case 2:
        playRepeat++;
        if (playRepeat == 2) {
          playListIndex++;
          playRepeat = 0;
          console.log(playListIndex);

          if (playListIndex > playlist.length - 1) {
            playListIndex = 0;
          }
        }

        break;
    }

    switch (loadSongFromArray) {
      case "newset":
        loadSong(
          newsetArray[
            newsetArray.findIndex((x) => x.id == playlist[playListIndex].id)
          ]
        );
        console.log(
          newsetArray[
            newsetArray.findIndex((x) => x.id == playlist[playListIndex].id)
          ]
        );
        break;
    }

    playSong();
  }

  function repeatSong() {
    switch (SwitchRepeat) {
      case 1:
        btnRepeat.style.opacity = "1";
        btnRepeat.style.color = "#F8AE5E";
        SwitchRepeat = 2;
        break;
      case 2:
        btnRepeat.style.opacity = "";
        btnRepeat.style.color = "#fff";
        SwitchRepeat = 1;
        break;
    }
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

  for (let i = 0; i < 5; i++) {
    var div = document.createElement("div");
    div.className = "item-board";
    const id = `${songs[i].id}`;
    div.id = id;

    let sample = `<img src="assets/file/cover/${songs[i].cover}" alt="img ${songs[i].cover}">
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
    if (id == 4) {
      divDots.className = "item-dots dot-active";
    }
    divDots.id = id;
    dots_board.appendChild(divDots);
    item_dots = document.querySelectorAll(".item-dots");
  }

  clickItemboard();
  function clickItemboard() {
    item_board.forEach((element) => {
      element.addEventListener("click", () => {
        addToPlayList(element.id);
        location.assign("#mp3");
      });
    });
  }

  clickItemDot();
  let centerBoard = board.offsetWidth,
    curerentSilde = 4,
    witdthElement = item_board.offsetWidth;
  function clickItemDot() {
    item_dots.forEach((element) => {
      element.addEventListener("click", () => {
        if (!witdthElement) {
          witdthElement = item_board[element.id].offsetWidth;
        }

        if (element.id >= 5) {
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

        var current = document.getElementsByClassName("dot-active");
        current[0].className = current[0].className.replace(" dot-active", "");
        element.className += " dot-active";
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////  add - clear - update playlist  ////////////////////////////////////
  ////////////////////////////  open-close playlist            ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  function ClosePlayList() {
    playlist_onplay.style.display == "none"
      ? (playlist_onplay.style.display = "flex")
      : (playlist_onplay.style.display = "none");
  }

  let list_music_onplay = document.querySelector(".list-music-onplay"),
    item_playlist,
    item_playlist_div,
    btn_play,
    clearToListItem;

  function addToPlayList(id) {
    // loadSong(songs[songs.findIndex((x) => x.id == id)]);

    switch (loadSongFromArray) {
      case "newset":
        loadSong(newsetArray[newsetArray.findIndex((x) => x.id == id)]);
        break;
    }
    // console.log(`${loadSongFromArray}`);

    playSong();

    const foundSong = playlist.find((x) => x.id == id);

    if (!foundSong) {
      const addArray = newsetArray.find((x) => x.id == id);

      playlist.push({
        id: addArray.id,
        name: addArray.name,
        cover: addArray.cover,
        singer: addArray.singer,
      });

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
      div.id = `${playlist[i].id}`;
      var indexx = songs.findIndex((x) => x.id == playlist[i].id);

      let sample = `<div id = ${playlist[i].id}>
                        <img src="assets/file/cover/${playlist[i].cover}" alt="img cover">
                        <div>
                            <p>${playlist[i].name}</p>
                            <p>${playlist[i].singer}</p>
                        </div>
                  </div>
                  <div>
                  <i class="fa fa-trash title-2 btn-item" id=${playlist[i].id}></i>
                  <i class="fa fa-circle-play title-2 btn-item" id=${playlist[i].id}></i>
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
    }
  }

  function fun_item_playlist() {
    item_playlist_div.forEach((element) => {
      element.addEventListener("click", () => {
        loadSong(songs[songs.findIndex((x) => x.id == element.id)]);
        playSong();
        let index = playlist.indexOf(element.id);
        playListIndex = index;
      });
    });
    btn_play.forEach((element) => {
      element.addEventListener("click", () => {
        loadSong(songs[songs.findIndex((x) => x.id == element.id)]);
        playSong();

        let index = playlist.indexOf(element.id);
        playListIndex = index;
      });
    });
  }

  function fun_clearToListItem() {
    clearToListItem.forEach((element) => {
      element.addEventListener("click", () => {
        if (element.id != idOnplay) {
          const index = playlist.indexOf(element.id);
          if (index > -1) {
            playlist.splice(index, 1);
          }
          updatePlaylist();
        }
      });
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  ////////////////////////////         Newset Music          ////////////////////////////////////
  ////////////////////////////                                 ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  let listNewset = document.querySelector("#newset"),
    playIcon,
    coverImg,
    nameSinger;

  formData.append("fun", "newest");

  async function postData(url = "", data) {
    const response = await fetch(url, { method: "POST", body: data });
    return response.json();
  }

  postData(url, formData).then((data) => {
    if (data != "" || null) {
      for (let i = 0; i < data.length; i++) {
        newsetArray.push({
          id: data[i].id,
          name: data[i].name,
          cover: data[i].cover,
          singer: data[i].singer,
        });

        var div = document.createElement("div");
        div.className = "item-list-music";
        const id = `${data[i].id}`;

        let sample = `<div class="cover" id="${id}">
                        <img src="assets/file/cover/${data[i].cover}" alt="img ${data[i].cover}">
                        <span></span>
                      </div>
                      <div class="name">
                        <i class="fa fa-play-circle" id="${id}"></i>
                        <div>
                            <p>${data[i].name}</p>
                            <p id="${id}">${data[i].singer}</p>
                        </div>
                      </div>`;

        div.innerHTML = sample;
        listNewset.appendChild(div);
        coverImg = document.querySelectorAll(".cover");
        playIcon = document.querySelectorAll(".name i");
        nameSinger = document.querySelectorAll(".name div p:nth-child(2)");
      }
    }
    for (let [key, value] of formData) {
      formData.delete(key, value);
    }
    playIconFun();
  });
  //   .then(function (response) {
  //     return response.json();
  //   })
  //   .then(function (myJson) {
  //     if (myJson != "" || null) {
  //       for (let i = 0; i < myJson.length; i++) {
  //         newsetArray.push({
  //           id: myJson[i].id,
  //           name: myJson[i].name,
  //           cover: myJson[i].cover,
  //           singer: myJson[i].singer,
  //         });

  //         var div = document.createElement("div");
  //         div.className = "item-list-music";
  //         const id = `${myJson[i].id}`;

  //         let sample = `<div class="cover" id="${id}">
  //                         <img src="assets/file/cover/${myJson[i].cover}" alt="img ${myJson[i].cover}">
  //                         <span></span>
  //                       </div>
  //                       <div class="name">
  //                         <i class="fa fa-play-circle" id="${id}"></i>
  //                         <div>
  //                             <p>${myJson[i].name}</p>
  //                             <p id="${id}">${myJson[i].singer}</p>
  //                         </div>
  //                       </div>`;

  //         div.innerHTML = sample;
  //         listNewset.appendChild(div);
  //         coverImg = document.querySelectorAll(".cover");
  //         playIcon = document.querySelectorAll(".name i");
  //         nameSinger = document.querySelectorAll(".name div p:nth-child(2)");

  //       }
  //     }

  //     for (let [key, value] of formData) {
  //       formData.delete(key, value);
  //     }

  //   });

  function playIconFun() {
    playIcon.forEach((element) => {
      element.addEventListener("click", () => {
        loadSongFromArray = "newset";
        addToPlayList(element.id);
        let index = playlist.indexOf(element.id);
        playListIndex = index;
      });
    });

    coverImg.forEach((element) => {
      element.addEventListener("click", () => {

        let data = newsetArray.find((x) => x.id == element.id);
       
       
        // location.assign("#mp3");

      });
    });

    nameSinger.forEach((element) => {
      element.addEventListener("click", () => {});
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////                                 ////////////////////////////////////
////////////////////////////          switch page            ////////////////////////////////////
////////////////////////////                                 ////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// let index = ArrPage[ArrPage.findIndex((x) => x.name == namePage)];
// const found = arrPage.find((element) => element == namePage);
// let index = arrPage.indexOf(namePage);

let arrPage = ["main", "mp3"];

window.addEventListener(
  "hashchange",
  () => {
    var hash = location.hash;

    let start = hash.lastIndexOf("#");
    let end = hash.lastIndexOf("");
    let namePage = hash.substring(start + 1, end);

    switch (hash) {
      case "#mp3":
        showPage();
        document.getElementById("include-" + namePage).style.display = "flex";

        break;
      default:
        showPage();
        document.getElementById("include-main").style.display = "block";
        break;
    }

    function showPage() {
      for (var i = 0; i < arrPage.length; i++) {
        document.getElementById("include-" + arrPage[i]).style.display = "none";
      }
    }
  },
  false
);
