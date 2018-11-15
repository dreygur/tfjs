//import * as tf from '@tensorflow/tfjs';
//import yolo, { downloadModel } from 'tfjs-yolo-tiny';

//import { Webcam } from './webcam';


myFirst = true

let model;
const webcam = new Webcam(document.getElementById('webcam'));

(async function main() {
  try {
    //ga(); causing issues
    model = await downloadModel();

    await webcam.setup();

    doneLoading();
    run();
  } catch(e) {
    console.error(e);
    showError();
  }
})();

async function run() {
  while (true) {
    clearRects();

    const inputImage = webcam.capture();

    //const t0 = performance.now();

    const boxes = await yolo(inputImage, model);

    //const t1 = performance.now();
   // console.log("YOLO inference took " + (t1 - t0) + " milliseconds.");

    boxes.forEach(box => {
      const {
        top, left, bottom, right, classProb, className,
      } = box;

      drawRect(left, top, right-left, bottom-top, `${className} Confidence: ${Math.round(classProb * 100)}%`)

     document.getElementById('myDiv01').innerHTML += className + ' at:'+Math.round(classProb * 100) +'%<br>'   // add text to webpage

    });

  

    await tf.nextFrame();
  }
}

const webcamElem = document.getElementById('webcam-wrapper');

function drawRect(x, y, w, h, text = '', color = 'red') {
  const rect = document.createElement('div');
  rect.classList.add('rect');
  rect.style.cssText = `top: ${y}; left: ${x}; width: ${w}; height: ${h}; border-color: ${color}`;

  const label = document.createElement('div');
  label.classList.add('label');
  label.innerText = text;
  rect.appendChild(label);

  webcamElem.appendChild(rect);

 // document.getElementById('myDiv01').innerHTML += text+'<br>'   // add text to webpage
}




function clearRects() {
  if (document.getElementById('myDiv01').innerHTML == ''){
      if (myFirst){ 
        document.getElementById('myDivOld').innerHTML = '.' 
         myFirst = false 
      } else {
         document.getElementById('myDivOld').innerHTML += '.'

     }
   } else {
      myFirst = true
      document.getElementById('myDivOld').innerHTML = 'was '+document.getElementById('myDiv01').innerHTML  // keep
      document.getElementById('myDiv01').innerHTML = ''   
  }                                                 // delete old comment

  const rects = document.getElementsByClassName('rect');
  while(rects[0]) {
    rects[0].parentNode.removeChild(rects[0]);
  }
}

function doneLoading() {
  const elem = document.getElementById('loading-message');
  elem.style.display = 'none';

  const successElem = document.getElementById('success-message');
  successElem.style.display = 'block';

  const webcamElem = document.getElementById('webcam-wrapper');
  webcamElem.style.display = 'block';
}

function showError() {
  const elem = document.getElementById('error-message');
  elem.style.display = 'block';
  doneLoading();
}

