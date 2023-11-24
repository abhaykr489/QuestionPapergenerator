const fs = require('fs');
const readlineSync = require('readline-sync');
const questionsData = require('./data/questions.json');


// Fisher-Yates shuffle algorithm to randomize the questions:
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomQuestionsByDifficulty(difficulty, count) {
  const filteredQuestions = questionsData.filter((question) => question.difficulty === difficulty);
  const shuffledQuestions = shuffleArray(filteredQuestions);
  return shuffledQuestions.slice(0, count);
}

function generateQuestionPaper(totalMarks, easyPercentage, mediumPercentage, hardPercentage) {

  const totalPercentage = easyPercentage + mediumPercentage + hardPercentage;

  if (totalPercentage > 100) {
    console.error('Error: Total percentage exceeds 100%. Please adjust the percentages.');
    return null; // Return null to indicate an error
  }
  const easyCount = Math.round((easyPercentage / 100) * (totalMarks / 5));
  const mediumCount = Math.round((mediumPercentage / 100) * (totalMarks / 10));
  const hardCount = Math.round((hardPercentage / 100) * (totalMarks / 15));

  const easyQuestions = getRandomQuestionsByDifficulty('Easy', easyCount);
  const mediumQuestions = getRandomQuestionsByDifficulty('Medium', mediumCount);
  const hardQuestions = getRandomQuestionsByDifficulty('Hard', hardCount);

  const questionPaper = {
    totalMarks,
    sections: {
      Easy: easyQuestions,
      Medium: mediumQuestions,
      Hard: hardQuestions,
    },
  };

  return questionPaper;
}


function saveQuestionPaperToFile(questionPaper) {
  const jsonData = JSON.stringify(questionPaper, null, 2);
  fs.writeFileSync('generatedQuestion.json', jsonData);
  console.log('Generated Question Paper has been saved to generatedQuestion.json');
}


function main() {
  const totalMarks = parseInt(readlineSync.question('Enter total marks for the question paper: '));
  const easyPercentage = parseInt(readlineSync.question('Enter percentage of Easy questions: '));
  const mediumPercentage = parseInt(readlineSync.question('Enter percentage of Medium questions: '));
  const hardPercentage = parseInt(readlineSync.question('Enter percentage of Hard questions: '));

  const questionPaper = generateQuestionPaper(totalMarks, easyPercentage, mediumPercentage, hardPercentage);

  saveQuestionPaperToFile(questionPaper);
}

main();
