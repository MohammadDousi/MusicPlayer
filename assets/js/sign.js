let sectionSignUp = document.getElementById("section-FormSignUp");
let sectionSignIn = document.getElementById("section-FormSignIn");

let imgSign = document.getElementById("img-sign");

let showSignUp = document.getElementById("show-signUp");
showSignUp.addEventListener("click", (e) => {
  sectionSignIn.style.display = "none";
  sectionSignUp.style.display = "flex";

  count = 60;
  let mytimer = setInterval(() => {
    if (count <= 30) {
      clearInterval(mytimer);
    }
    count = count - 1;
    imgSign.style.width = `${count}%`;
  }, 10);
});

let showSignIn = document.getElementById("show-signIn");
showSignIn.addEventListener("click", (e) => {

  count = 30;
  let mytimer = setInterval(() => {
    if (count >= 60) {
      clearInterval(mytimer);
    }
    count = count + 1;
    imgSign.style.width = `${count}%`;
  }, 10);

  sectionSignIn.style.display = "flex";
  sectionSignUp.style.display = "none";
});
