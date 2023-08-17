const welcomePage = document.querySelector(".welcomepage");
const rowNumberRange = welcomePage.querySelector("#rowNumber");
const startBtn = welcomePage.querySelector(".startBtn");
const displayRowNum = welcomePage.querySelector("h2");
const restartBtns = document.querySelectorAll(".restartBtn");
const gameWrapper = document.querySelector(".gameWrapper");
const imgWrappers = document.querySelectorAll(".imgWrapper");
const popUpResult = document.querySelector(".popUpResult");
const totalMoveTaken = popUpResult.querySelector(".totalMoveTaken");
const totalTakenTime = popUpResult.querySelector('h3');
const totalTimer = document.querySelector(".timerWatch h4");

// Image List
let imgList = [
  "img01",
  "img02",
  "img03",
  "img04",
  "img05",
  "img06",
  "img07",
  "img08",
  "img09",
  "img10",
  "img11",
  "img12",
  "img13",
  "img14",
  "img15",
  "img16",
  "img17",
  "img18",
];

// variable that need to predefined
let rowNumber = 0;
let previousCard;
let totalMove = 0;
let timerInterval;
let timerLastTime = "00 : 00 : 00";


rowNumberRange.value = 2;
displayRowNum.innerText = "0" + rowNumberRange.value;

imgList.forEach((imgName, i) => {
  imgList[i] = "images/" + imgName + ".jpg";
});


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

rowNumberRange.addEventListener("change", (e) => {
  displayRowNum.innerText = "0" + e.target.value;
});

const firstPreview = () => {
  gameWrapper.classList.add("notEditable");
  setTimeout(() => {
    gameWrapper.classList.remove("notEditable");
  }, 1000);
};

const getFormatedTime = (time) => {
  const hours = Math.round(time / (1000 * 60 * 60));
  time %= 1000 * 60 * 60;
  const minutes = Math.round(time / (1000 * 60));
  time %= 1000 * 60;
  const seconds = Math.round(time / 1000);
  return `${hours < 10 ? "0" + hours : hours} : ${
    minutes < 10 ? "0" + minutes : minutes
  } : ${seconds < 10 ? "0" + seconds : seconds}`;
};
const timer = (startTime) => {
  startTime += 1000;
  timerInterval = setInterval(() => {
    let totalTime = new Date().getTime() - startTime;
    timerLastTime = getFormatedTime(totalTime);
    totalTimer.innerText = timerLastTime;
  }, 1000);
};

startBtn.addEventListener("click", () => {
  rowNumber = Number(rowNumberRange.value);
  welcomePage.classList.add("hide");
  totalMove = 0;
  imgDisplay(rowNumber);
  gameWrapper.style.gridTemplateColumns = `repeat(${rowNumber}, 1fr)`;
  previousCard = undefined;

  firstPreview();
  totalTimer.innerText = "00 : 00 : 00";
  clearInterval(timerInterval);
  timer(new Date().getTime());
});

restartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    welcomePage.classList.remove("hide");
    popUpResult.classList.remove("add");
    totalMove = 0;
  });
});

const imgDisplay = (rowNumber) => {
  let tempImgList = imgList.slice(0, (rowNumber * rowNumber) / 2);
  tempImgList = [...tempImgList, ...tempImgList];
  shuffleArray(tempImgList);
  imgListGenerate(tempImgList);
};

const imgListGenerate = (imgListToShow) => {
  gameWrapper.innerHTML = "";
  imgListToShow.forEach((img, i) => {
    imgGenerate(img, i + 1);
  });
};

const imgGenerate = (imgPath, i) => {
  gameWrapper.innerHTML += `<div class='imgWrapper' data-id='${i}'>
        <img src='${imgPath}' alt=''>
        <div class='number'>${i}</div>
    </div>`;
};

document.addEventListener("click", (e) => {
  if (gameWrapper.contains(e.target)) {
    totalMove++;

    let setTimeOutOfCard;
    // Main logic
    if (e.target.parentNode.classList.contains("imgWrapper")) {
      let currentCard = e.target;
      currentCard = currentCard.parentNode;

      let differentID = true,
        srcMatch = true;
      if (Boolean(previousCard)) {
        differentID =
          currentCard.getAttribute("data-id") !==
          previousCard.getAttribute("data-id");
        srcMatch =
          currentCard.querySelector("img").src ===
          previousCard.querySelector("img").src;

        if (differentID && srcMatch) {
          currentCard.classList.add("finished");
          previousCard.classList.add("finished");
          previousCard = undefined;
        } else {
          currentCard.classList.add("active");
          previousCard.classList.add("active");
          let tempPrevious = previousCard;
          previousCard = undefined;
          setTimeOutOfCard = setTimeout(() => {
            currentCard.classList.remove("active");
            tempPrevious.classList.remove("active");
          }, 800);
        }
      } else {
        clearTimeout(setTimeOutOfCard);
        gameWrapper.childNodes.forEach((element) => {
          element.classList.remove("active");
        });
        currentCard.classList.add("active");
        previousCard = currentCard;
      }
    }

    // Checking finised or not
    let finishedBlock = 0;
    gameWrapper.childNodes.forEach((element) => {
      if (element.classList.contains("finished")) {
        finishedBlock++;
      }
    });

    // checking total move
    console.log(finishedBlock);
    if (finishedBlock == gameWrapper.childNodes.length) {
      popUpResult.classList.add("add");
      totalMoveTaken.innerText = totalMove;
      totalTakenTime.innerText = timerLastTime;
      clearInterval(timerInterval);
    }
  }
});
