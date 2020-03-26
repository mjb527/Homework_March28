
// js object for questions
const Questions = {
  1 : {
    question: "Which of these is a legal variable declaration keyword?",
    options : ['let', 'const', 'var', 'All of the above'],
    correct : 'All of the above'
  } ,
  2 : {
    question: "What does 'DOM' stand for?",
    options : ['Document Object Model', 'Drop Operation Mechanics', 'Drink Only Margaritas', 'Document Object Method'],
    correct : 'Document Object Model'
  },
  3 : {
    question: "Which of these is not a JavaScript framework?",
    options : ['jQuery', 'Angular', 'Bootstrap', 'Vue'],
    correct : 'Bootstrap'
  },
  4 : {
    question: "What would the result of i + 1 where i = 'Hello there'?",
    options : ['NaN', 'Hello there1', 'H1e1l1l1o1 1t1h1e1r1e1', 'undefined'],
    correct : 'Hello there1'
  },
  5 : {
    question: "How long did it take for JavaScript to be developed originally?",
    options : ['10 days', '6 months', '4 years', '2 years, 3 months'],
    correct : '10 days'
  },
  6 : {
    question: "Where can JavaScript be used??",
    options : ['Client side', 'Server side', 'Robotics', 'Anywhere'],
    correct : 'Anywhere'
  },
  7 : {
    question: "What does the '===' symbol do?",
    options : ['Compare two values', 'Compare two values and their types', 'Set a value to a variable', 'Nothing, it would throw an error'],
    correct : 'Compare two values and their types'
  },
  8 : {
    question: "What is the purpose of a global variable?",
    options : ['Available anywhere in the code', 'Available in any function, but not outside them', 'They enjoy traveling', 'They cannot be changed once declared'],
    correct : 'Available anywhere in the code'
  },
  9 : {
    question: "What is the purpose of the 'this' keyword?",
    options : ['Refers to the document', 'Refers to the object in a method', 'Refers to the computer', 'Refers to the script'],
    correct : 'Refers to the object in a method'
  },
  10 : {
    question: "Select the line of code that would assign an element to a variable. ",
    options : ['document.getElementByClass(".myClass");', 'let x = document.getElementBySelector("#my-id")', 'const y = document.getElementById(".my-id")', 'const z = document.getElementById("#my-id")'],
    correct : 'const z = document.getElementById("#my-id")'
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
let timeLeft = 60;
let timer;
const timeEl = document.getElementById('timer');

// prevent right click to help prevent cheating
document.addEventListener('contextmenu', event => event.preventDefault());
document.querySelector('#start-button').addEventListener('click', start, event);

document.querySelector('#restart').addEventListener('click', function(event) {
  event.preventDefault();
  location.reload();
  return false;
}, event);

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
  document.getElementById('scorecard').style.display = "none";
  document.querySelector('#start-screen').style.display = 'none';
  document.querySelector('#question-box').style.display = 'flex';
  // start timer
  timer = setInterval(countdown, 1000);
};

function checkAnswer(event) {
  event.preventDefault();
  if(event.target.innerHTML === question.correct) {
    correct++;
    timeLeft += 5;
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
    gameover();
  }
  else {
    timeLeft--;
    timeEl.innerHTML = timeLeft + ' seconds remaining';
  }
}

function gameover() {

  clearTimeout(timer);

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


  if (timeLeft > 0) {
    // get the top 5 scores
    let highscoresOBJ = null;
    let highscores = null;
    if(localStorage.getItem('highscores') !== null) {
      highscoresOBJ = JSON.parse(localStorage.getItem('highscores'));
      console.log(highscoresOBJ);
      highscores = [ highscoresOBJ['0'], highscoresOBJ['1'], highscoresOBJ['2'], highscoresOBJ['3'], highscoresOBJ['4']];
    }

    // console.log(highscores[4]);

    let currHighscore = (correct * timeLeft);

    // if highscores is undefined, set it to be the highest
    if(highscores === null) {
      const name = prompt("You got the highest score! What's your name?");
      const info = {'name' : name, 'correct' : correct, 'incorrect' : incorrect, 'timeleft' : timeLeft, 'highscore' : currHighscore};
      const placeholder = {'name' : ' -- ', 'correct' : 0, 'incorrect' : 0, 'timeLeft' : 0, 'highscore' : 0};

      localStorage.setItem('highscores',JSON.stringify({0:info, 1:placeholder, 2:placeholder, 3:placeholder, 4:placeholder}));
    }

    // high score is calculated by multiplying the number correct by the seconds left
    // in case of win somewhere
    else if (currHighscore > highscores[4].highscore) {
      const name = prompt("You got a high score! What's your name?");
      const info = {'name' : name, 'correct' : correct, 'incorrect' : incorrect, 'timeleft' : timeLeft, 'highscore' : currHighscore};

      for(let i = 4; i > -1; i--) {
        const temp = highscores[i];
        const arrHighscore = temp.highscore;

        // beat current index's score
        if(currHighscore > arrHighscore && i != 0)
        // go to next array and check
          continue;
        // found a tie, put behind it
        else if(currHighscore <= arrHighscore) {
          alert('You ranked ' + (i+2).toString() );
          // set new spot at i + 1
          highscores.splice(i + 1, 0, info);
          // pop to remove last index
          highscores.pop();
          break;
        }
        // high score
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

    // in case of tie
    else if(currHighscore === highscores[4].highscore && timeLeft !== 0 ) {
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
}
