import React, { useState, useEffect } from "react";

function HallenSplit() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(""); // Added state for correct answer
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    import("../data/hallen_split.json").then((module) => {
      setData(module.default.sort(() => Math.random() - 0.5));
    });
  }, []);

  const checkAnswer = (userAnswer) => {
    if (answered) return;
    setAnswered(true);

    const currentQuestion = data[currentIndex];
    const correctAnswers = currentQuestion.correctAnswers.map((ans) =>
      ans.toLowerCase().trim()
    );
    const userAnswerTrimmed = userAnswer.toLowerCase().trim();
    const isCorrect = correctAnswers.includes(userAnswerTrimmed);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCorrectAnswer(""); // Reset correct answer state if correct
    } else {
      setCorrectAnswer(correctAnswers.join(", ")); // Store the correct answer(s) if incorrect
    }
    setTotalAnswered((prev) => prev + 1);

    setFeedback(isCorrect ? "Richtig" : "Falsch");
  };

  const nextQuestion = () => {
    setAnswered(false);
    if (currentIndex + 1 === data.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setFeedback("");
      setCorrectAnswer(""); // Reset correct answer when moving to next question
    }
  };

  const endTestEarly = () => {
    setIsFinished(true);
  };

  const restartTest = () => {
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setFeedback("");
    setAnswered(false);
    setCorrectAnswer(""); // Reset correct answer state
  };

  if (!data.length) return <p>Loading...</p>;
  if (isFinished)
    return (
      <div>
        <h2>Hallen Split</h2>
        <h4>Test beendet!</h4>
        <p>
          Dein Ergebnis: <strong>{score} / {totalAnswered}</strong> Fragen wurden richtig beantwortet.
        </p>
        <button onClick={restartTest}>Test wiederholen</button>
      </div>
    );

  const currentQuestion = data[currentIndex];

  return (
    <div>
      <h2>Hallen Split</h2>
      <div style={{ marginTop: "40px" }}></div>
      <h3>{currentQuestion.question}</h3>
      <div>
        {["Halle 4", "Halle 7", "Fracht West", "Embargo"].map((option) => (
          <button
            key={option}
            onClick={() => checkAnswer(option)}
            disabled={answered}
            className={option.toLowerCase().replace(" ", "-")}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && (
        <div>
          <p style={{ color: feedback === "Richtig" ? "green" : "red" }}>
            {feedback}
          </p>
          {feedback === "Falsch" && correctAnswer && (
            <p style={{ color: "orange" }}>{currentQuestion.question}: {correctAnswer}</p>
          )}
          <button onClick={nextQuestion}>Nächste Frage</button>
        </div>
      )}
      <button onClick={endTestEarly} style={{ marginTop: "20px" }}>
        Test vorzeitig beenden
      </button>
    </div>
  );
}

export default HallenSplit;
