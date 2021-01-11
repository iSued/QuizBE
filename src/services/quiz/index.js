const express = require("express");
const fs = require("fs-extra");
const uniqid = require("uniqid");
const path = require("path");

const router = express.Router();
const QuestionsFilePath = path.join(__dirname, "questions.json");
const ExamsFilePath = path.join(__dirname, "exams.json");

const writeExams = async (exam) => {
  const content = await fs.readJSON(ExamsFilePath);
  await fs.writeJSON(ExamsFilePath, [...content, exam]);
};

const writeQuestions = async (content) =>
  await fs.writeFile(QuestionsFilePath, JSON.stringify(content));

router.post("/start", async (req, res, next) => {
  try {
    const exam = {
      ...req.body,
      _id: uniqid(),
      examDate: new Date(),
      isCompleted: false,
      name: "Admission Test",
      score: 0,
      questions: [],
    };
    const question = await fs.readJSON(QuestionsFilePath);

    for (let i = 1; i <= 5; i++) {
      let randomindex = Math.floor(Math.random() * question.length);
      exam.questions.push(question[randomindex]);
    }
    console.log(exam);
    writeExams(exam);

    res.status(201).send({ id: exam._id });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const exams = await fs.readJSON(ExamsFilePath);
    let exam = exams.find((exam) => exam._id === req.params.id);
    if (!exam) {
      res.send("this exam does not exist");
      const error = new Error("Cannot find element " + req.params.id);
      error.httpStatusCode = 404;
      next(error);
    } else {
      exam.questions = exam.questions.map((question) =>
        question.answers.map((answer) => {
          delete answer.isCorrect;
          return answer;
        })
      );
      res.send(exam);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

let score = 0;
router.post("/:id/answer", async (req, res, next) => {
  try {
    // 0,1

    const exams = await fs.readJSON(ExamsFilePath);
    const exam = exams.find((exam) => exam._id === req.params.id);
    if (!exam) {
      res.send("this exam does not exist");
      const error = new Error("Cannot find element " + req.params.id);
      error.httpStatusCode = 404;
      next(error);
    } else {
      const { answerIndex, questionIndex } = req.body;
      if (exam.questions[questionIndex].answers[answerIndex].isCorrect) {
        score += 1;
        res.send(`correct!!the score is ${score}`);
      } else res.send(`not correct!!the score is ${score}`);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
