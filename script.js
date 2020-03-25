
// js object for questions
const Questions = {
  1 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  } ,
  2 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  3 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  4 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  5 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  6 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  7 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  8 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  9 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  10 : {
    question: "What color is red?",
    options : ['Red', 'Orange', 'Green', 'Blue'],
    correct : 'Red'
  },
  // shuffle algorithm shamelessly stolen from stackoverflow
  // https://stackoverflow.com/a/6274381/11922025
  shuffle : function(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

let question = null;
let correct = 0;
let incorrect = 0;

// list of questions to be used in the test
let questionsArr;// = Questions.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// current question to be displayed, need to get this var - 1 for array
let currentQuestion;// = 1;
let questionIndex;// = 0;

let correctResponse = "";

// timer stuff
let timeLeft = 30;
let timer;
const timeEl = document.getElementById('timer');

// prevent right click to help prevent cheating
document.addEventListener('contextmenu', event => event.preventDefault());
document.querySelector('#start-button').addEventListener('click', start, event);
document.querySelector('#restart').addEventListener('click', start, event);

// add event listener to each answer-choice in the card
const answerChoices = document.getElementsByClassName('answer-choice');
for(let i = 0; i < answerChoices.length; i++) {
  answerChoices[i].addEventListener('click',checkAnswer, event);
}

function start(event) {
  event.preventDefault();
  // reset the starting parameters
  questionIndex = 0;
  currentQuestion = 1;
  timeleft = 30;
  questionsArr = Questions.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  loadQuestion();

  // display the questions when start is clicked
  document.querySelector('#start-screen').style.display = 'none';
  document.querySelector('#question-box').style.display = 'flex';
  // start timer
  timer = setInterval(countdown, 1000);
};

function checkAnswer(event) {
  event.preventDefault();
  if(event.originalTarget.innerHTML === question.correct) {
    correct++;
    timeLeft += 3;
  }
  else {
    incorrect++;
    timeLeft -= 5;
  }
  // increment the ints that control the number presented on screen (1-10)
  // and the array index
  currentQuestion++;
  questionIndex++;
  loadQuestion();
}

// populate the next question
function loadQuestion() {
  if(questionIndex == 10) {
    gameover();
  }
  else {
    // get the question json
    question = Questions[questionsArr[questionIndex]];
    // shuffle the answers, provide the array of potential answers
    const answerChoices = document.getElementsByClassName('answer-choice');
    const arr = Questions.shuffle(question.options);
    // add question to #question
    document.getElementById('question-title').innerHTML = "Question " + currentQuestion;
    document.getElementById('question').innerHTML = question.question;

    // add answers to answer choices
    for (let i = 0; i < arr.length; i++) {
      answerChoices[i].innerHTML = arr[i];
    }

  }
}

function countdown() {
  if(timeLeft <= 0) {
    clearTimeout(timer);
    gameover();
  }
  else {
    timeLeft--;
    timeEl.innerHTML = timeLeft + ' seconds remaining';
  }
}

function gameover() {
  // lose condition
  if(timeLeft <= 0) {
    timeLeft = 0;
    timeEl.innerHTML = '0 seconds remaining';
    const audio = new Audio('static/womp-womp.mp3');
    audio.volume = 0.5;
    audio.play();
    document.getElementById('win-status').innerHTML = 'You Lose!';
  }
  // win condition
  else {
    clearTimeout(timer);
    const audio = new Audio('static/Win-fanfare-sound.mp3');
    audio.volume = 0.5;
    audio.play();
    document.getElementById('win-status').innerHTML = 'You Win!';
  }

  // display the correct elements and populate them
  document.querySelector('#question-box').style.display = 'none';
  document.querySelector('#scorecard').style.display = 'flex';

  document.getElementById('number-correct').innerHTML = correct + " answered correctly";
  document.getElementById('number-incorrect').innerHTML = incorrect + " answered incorrectly";
  document.getElementById('time-remaining').innerHTML = timeLeft + " second(s) left";

  // get the top 5 scores
  let highscoresOBJ = null;
  let highsocres = null;
  if(localStorage.getItem('highscores') !== null) {
    highscoresOBJ = JSON.parse(localStorage.getItem('highscores'));
    highscores = [JSON.parse(highscoresOBJ['1']), JSON.parse(highscoresOBJ['2']), JSON.parse(highscoresOBJ['3']), JSON.parse(highscoresOBJ['4']), JSON.parse(highscoresOBJ['5'])];
  }

  // console.log(highscores[4]);

  let currHighscore = (correct * timeLeft);

  // if highscores is undefined, set it to be the highest
  if(highscores === null) {
    const name = prompt("You got the highest score! What's your name?");
    const info = JSON.stringify({'name' : name, 'correct' : correct, 'incorrect' : incorrect, 'timeleft' : timeLeft, 'highscore' : currHighscore});
    console.log(info);
    const placeholder = JSON.stringify({'name' : ' -- ', 'correct' : 0, 'incorrect' : 0, 'timeLeft' : 0, 'highscore' : 0});
    localStorage.setItem('highscores',JSON.stringify({1:info, 2:placeholder, 3:placeholder, 4:placeholder, 5:placeholder}));
  }

  // high score is calculated by multiplying the number correct by the seconds left
  else if (currHighscore > highscores[4].highscore) {
    alert('hooray');
    const name = prompt("You got a high score! What's your name?");
    const info = JSON.stringify({'name' : name, 'correct' : correct, 'incorrect' : incorrect, 'timeleft' : timeLeft, 'highscore' : currHighscore});
    // ugh... sorting
    for(let i = 4; i > -1; i++) {
      const temp = highscores[i];
      const arrHighscore = temp.highscore;
      console.log(arrHighscore);
      if(currHighscore > arrHighscore && i != 0)
      // go to next array and check
        continue;
      else if(currHighscore <= arrHighscore) {
        alert('You ranked ' + (i+2).tostring());
        // set new spot at i + 1
        highscores.splice(i, 0, info);
        // pop to remove last index
        highscores.pop();
        break;
      }
      else {
        alert('You got the highest score, congrats!');
        highscores.splice(i, 0, info);
        // pop to remove last index
        highscores.pop();
        break;
      }

    }
    // save to web storage
    localStorage.setItem('highscores', JSON.stringify(highscores));

  }
  else if(currHighscore === JSON.parse(highscores['4']).highscore ) {
    alert('You tied 5th place! Try again!');
  }
  // didn't make it to the high scores
  else if(currHighscore < JSON.parse(highscores['4']).highscore) {
    alert('You didn\'t make it to the top 5, try again!');
  }
  else {
    // should never get here
    console.log('something unepected happened');
  }
}
