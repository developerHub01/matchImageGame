const welcomePage = document.querySelector('.welcomepage');
const rowNumberRange = welcomePage.querySelector('#rowNumber');
const startBtn = welcomePage.querySelector('.startBtn');
const displayRowNum = welcomePage.querySelector('h2');
const restartBtns = document.querySelectorAll('.restartBtn');
const gameWrapper = document.querySelector('.gameWrapper');
const imgWrappers = document.querySelectorAll('.imgWrapper');
const popUpResult = document.querySelector('.popUpResult');
const totalMoveTaken = popUpResult.querySelector('.totalMoveTaken');

let rowNumber = 0;
// gameWrapper.innerHTML = '';

let totalMove = 0;

let imgList = [
  'img01',
  'img02',
  'img03',
  'img04',
  'img05',
  'img06',
  'img07',
  'img08',
  'img09',
  'img10',
  'img11',
  'img12',
  'img13',
  'img14',
  'img15',
  'img16',
  'img17',
  'img18',
];

rowNumberRange.value = 2;
displayRowNum.innerText = '0' + rowNumberRange.value;

imgList.forEach((imgName, i) => {
  imgList[i] = 'images/' + imgName + '.jpg';
});

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

rowNumberRange.addEventListener('change', (e) => {
  displayRowNum.innerText = '0' + e.target.value;
});

startBtn.addEventListener('click', () => {
  rowNumber = Number(rowNumberRange.value);
  welcomePage.classList.add('hide');
  totalMove = 0;
  imgDisplay(rowNumber);
  gameWrapper.style.gridTemplateColumns = `repeat(${rowNumber}, 1fr)`;
});

restartBtns.forEach((btn)=>{
  btn.addEventListener('click', (e) => {
    welcomePage.classList.remove('hide');
    popUpResult.classList.remove('add');
    totalMove = 0;
  });
})

const imgDisplay = (rowNumber) => {
  let tempImgList = imgList.slice(0, (rowNumber * rowNumber) / 2);
  tempImgList = [...tempImgList, ...tempImgList];
  shuffleArray(tempImgList);
  imgListGenerate(tempImgList);
};

const imgListGenerate = (imgListToShow) => {
  gameWrapper.innerHTML = '';
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

let previousCard;

document.addEventListener('click', (e) => {
  if(gameWrapper.contains(e.target)) {
    totalMove++;

    let setTimeOutOfCard;

    if(e.target.parentNode.classList.contains('imgWrapper')){
      let currentCard = e.target;
      currentCard = currentCard.parentNode;

      let differentID = true, srcMatch = true;
      if(Boolean(previousCard)){
        differentID = ((currentCard.getAttribute('data-id')) !== previousCard.getAttribute('data-id'));
        srcMatch = (currentCard.querySelector('img').src === previousCard.querySelector('img').src);

        if(differentID && srcMatch){
          currentCard.classList.add('finished');
          previousCard.classList.add('finished');
          previousCard = undefined;
        }else{
          currentCard.classList.add('active');
          previousCard.classList.add('active');
          let tempPrevious = previousCard;
          previousCard = undefined;
          setTimeOutOfCard = setTimeout(()=>{
            currentCard.classList.remove('active');
            tempPrevious.classList.remove('active');
            // setTimeout(()=>{
            //   previousCard = undefined; 
            // }, 1);
          }, 500);
        }

      }else{
        // imgWrappers.forEach((imgWrapper)=>{
        //   imgWrapper.classList.remove('active');
        // })
        clearTimeout(setTimeOutOfCard);
        currentCard.classList.add('active');
        previousCard = currentCard;
      }

    }
// ==================================================================

    // gameWrapper.childNodes.forEach((block) => {
    //   let differentID = true, srcMatch = true;
    //   if(previousCard != undefined){
    //     // console.log(block.getAttribute('data-id'));
    //     differentID = (block.getAttribute('data-id') !== previousCard.getAttribute('data-id'));
    //     srcMatch = (block.querySelector('img').src === previousCard.querySelector('img').src && differentID);
    //   }
    //   if (block.contains(e.target)) {
    //     if (
    //       previousCard != undefined &&
    //       srcMatch && differentID
    //     ) {
    //       previousCard.classList.add('finished');
    //       block.classList.add('finished');
    //     } else {
    //       block.classList.add('active');
    //       previousCard.classList.add('active');
    //       setTimeout(()=>{
    //         block.classList.remove('active');
    //       }, 1000);
    //       setTimeout(()=>{
    //         previousCard.classList.remove('active');
    //       }, 1000);
    //       // console.log('hello');
    //     }
    //   } 
    //   // else{
    //   //   setTimeout(() => {
    //   //     block.classList.remove('active');
    //   //   }, 500);
    //   // }

    //   // previousCard.classList.add('active');
    // });

// ===========================================================================

    // previousCard = e.target.parentNode;
    // console.log(previousCard);

    let finishedBlock = 0;
    gameWrapper.childNodes.forEach((element)=>{
      if(element.classList.contains('finished')){
         finishedBlock++;
      }
    });
    console.log(finishedBlock);
    if(finishedBlock == gameWrapper.childNodes.length){
      popUpResult.classList.add('add');
      totalMoveTaken.innerText = totalMove;
    }
  }
});
