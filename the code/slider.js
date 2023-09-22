const slides = document.getElementsByClassName("slide");
const slideCount = slides.length;

let i = 0;
function next() {
  i++;
  if (i < slideCount) {
    slides[i].style.left = "0";
    slides[i - 1].style.left = "-100%";
    console.log("advanced i = " + i);
  } else {
    i = 0; // Set current slide back to zero
    slides[i].style.left = "0";
    slides[slideCount - 1].style.left = "-100%";

    for (let x = 1; x < slideCount - 1; x++) {
      slides[x].style.left = "100%";
    }
  }
}

document.getElementById("next").onclick = next;

setInterval(next, 4000);

function prev() {
  i--;
  if (i >= 0) {
    slides[i].style.left = "0";
    slides[i + 1].style.left = "-100%";
    console.log("advanced i = " + i);
  } else {
    i = slideCount - 1; // Set current slide back to zero
    slides[i].style.left = "0";
    slides[0].style.left = "-100%";
    for (let x = slideCount - 1; x > 0; x--) {
      slides[x].style.right = "100%";
    }
  }
}

document.getElementById("previous").onclick = prev;
