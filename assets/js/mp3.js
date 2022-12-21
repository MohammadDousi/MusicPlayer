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


let btnDetails = document.querySelector(".btn-details");
let bodyDetails = document.querySelector(".body-details");
btnDetails.addEventListener("click", () => {

  if (!bodyDetails.classList.contains("show")) {
    
    bodyDetails.classList.add("show");
    bodyDetails.style.padding = "1.5rem 2rem";

    let count = 0, myInterval;

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
