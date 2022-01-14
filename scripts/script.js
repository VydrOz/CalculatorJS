// elements
const keys = document.getElementsByClassName("calculator")[0].getElementsByTagName("span");
const display = document.getElementsByClassName("display");
const dispResult = document.getElementById("result");
const dispCurrCalc = document.getElementById("current-calc");
const histoCalc = document.getElementsByClassName("histo-calcul")[0];
const toggleSwitch = document.getElementById('theme-switch');
// arrow function
const roundNumber = (n, d) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
const checkForBrackets = (n) => n >= 0 ? n : `(${n})`;
// global varibales
const opMap = new Map([
  ["÷", "/"],
  ["×", "*"],
  ["+", "+"],
  ["−", "-"]
]);
let switchOperator = false;
let isACalculResult = false;

//add EventListener click to each key
document.addEventListener("DOMContentLoaded", function () {
  display[0].addEventListener('animationend', () => {
    display[0].classList.remove("wrong-value");
  });
  
  for (let key of keys) {
    switch (key.id) {
      case "num":
        key.addEventListener("click", () => {AppendNum(key.innerText)});
        break;
      case "operator":
        key.addEventListener("click", () => {AppendOperator(key.innerText)});
        break;
      case "equ":
        key.addEventListener("click", Calcul);
        break;
      case "del":
        key.addEventListener("click", Delete);
        break;
      case "other":
        if(key.innerText === "←") {
          key.addEventListener("click", () => {
            dispResult.textContent = 
              dispResult.textContent.length === 1 || 
              dispResult.textContent.length === 2 && dispResult.textContent[0] === "-" 
              ? "0" : dispResult.textContent.replace(/.$/,'');
            switchOperator = dispCurrCalc.textContent !== "";
          });
        } else if (key.innerText === "±") {
          key.addEventListener("click", () => {
            dispResult.textContent = -dispResult.textContent;
          });
        } else if (key.innerText === ".") {
          key.addEventListener("click", () => {
            if(!dispResult.textContent.includes(".") && !isACalculResult) {
              dispResult.textContent += ".";
            } else if (!display[0].classList.contains("wrong-value")){
              display[0].classList.add("wrong-value");
            };
          });
        }
        break;
    }
  }
  
  document.addEventListener('keydown', keyDownEvent);
  document.addEventListener('keyup', keyUpEvent);
  
  //theme switch
  toggleSwitch.addEventListener('click', () => {
    let hasTheme = document.documentElement.getAttribute('data-theme') == null;
    hasTheme ? document.documentElement.setAttribute('data-theme', 'light') : document.documentElement.removeAttribute('data-theme', 'light');
    toggleSwitch.textContent = hasTheme ? "🌙" : "🌞";
  }, false);
});

// add keybord input mapping
function keyDownEvent(event) {
  let elm = document.querySelector(`[data-key='${event.key}']`)
  if(elm)
  {
    elm.click();
    elm.classList.add("active");
  }
}

function keyUpEvent(event) {
  let elm = document.querySelector(`[data-key='${event.key}']`)
  if(elm)
  {
    elm.classList.remove("active");
  }
}

function AppendNum(num) {
  if (dispResult.textContent === "0" || isACalculResult) {
    dispResult.textContent = num;
    isACalculResult = false;
  } else {
    dispResult.textContent += num;
  }
  if (dispCurrCalc.textContent !== "") switchOperator = false;
}

function AppendOperator(ope) {
  if (!opMap.has(ope)) return;

  if (switchOperator) {
    let regex = new RegExp(`(.*)([${Array.from(opMap.values()).join(',')}])(.*)$`, 'gi');
    dispCurrCalc.textContent = dispCurrCalc.textContent.replace(regex, `$1${opMap.get(ope)}$3`);
  } 
  else if(dispResult.textContent.slice(-1) === ".") {
    if(!display[0].classList.contains("wrong-value")) {
      display[0].classList.add("wrong-value")
    }
  }
  else {
    dispCurrCalc.textContent += `${checkForBrackets(dispResult.textContent)} ${opMap.get(ope)} `;
    dispResult.textContent = "0";
    switchOperator = true;
    isACalculResult = false;
  }
}

function Calcul() {
  if(dispCurrCalc.textContent === "" || dispResult.textContent.slice(-1) === "." ) return;
  let calc = `${dispCurrCalc.textContent}${checkForBrackets(dispResult.textContent)}`
  if(calc.slice(-3) === "/ 0") {
    var o = new Audio("https://www.myinstants.com/media/sounds/epic.mp3");
    o.play();
  }
  else {
    dispResult.textContent = eval(calc);
    Historize(calc, dispResult.textContent);
    ResetCalc();
  }
}

function Delete() {
  dispResult.textContent = "0";
  ResetCalc();
}

function ResetCalc() {
  dispCurrCalc.textContent = "";
  switchOperator = false;
  isACalculResult = dispResult.textContent !== "0";
}

// add result to hitory
function Historize(calc, result) {
  let spanC = document.createElement('span');
  let spanR = document.createElement('span');
  spanC.innerText = calc + " =";
  spanR.innerText = roundNumber(parseFloat(result),10);
  histoCalc.prepend(spanC,spanR);
}
