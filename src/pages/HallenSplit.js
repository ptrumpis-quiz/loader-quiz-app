import React, { useState, useEffect } from "react";

function HallenSplit() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

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
      ans.trim()
    );
    const userAnswerTrimmed = userAnswer.trim();
    const isCorrect = correctAnswers.includes(userAnswerTrimmed);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setCorrectAnswer("");
    } else {
      setCorrectAnswer(correctAnswers.join(", "));
      setWrongAnswers((prev) => [
        ...prev,
        { question: currentQuestion.question, correctAnswer: correctAnswers.join(", ") }
      ]);
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
      setCorrectAnswer("");
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
    setCorrectAnswer("");
    setWrongAnswers([]);
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
        {wrongAnswers.length > 0 && (
          <div>
            <h4 style={{ color: "blue" }}>Deine falsch beantwortete Fragen und die richtigen Antworten:</h4>
            <ul>
              {wrongAnswers.map((item, index) => (
                <li key={index} >
                  <strong>{item.question}</strong>: <strong>{item.correctAnswer}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={restartTest}>Test wiederholen</button>
      </div>
    );

  const currentQuestion = data[currentIndex];

  return (
    <div>
      <h2>Hallen Split</h2>
      <p>In welcher Halle wird das Land sortiert?</p>
      <div style={{ marginTop: "40px" }}></div>
      <h3 style={{ marginLeft: "180px" }}>{currentQuestion.question}</h3>
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
            <strong>{feedback}</strong>
          </p>
          {feedback === "Falsch" && correctAnswer && (
            <p style={{ color: "green" }}>Richtig wäre: <strong>{currentQuestion.question} = {correctAnswer}</strong></p>
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
