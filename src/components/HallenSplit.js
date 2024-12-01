import React, { useState, useEffect } from "react";

function HallenSplit() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState("");
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
    const isCorrect = correctAnswers.includes(userAnswer.toLowerCase().trim());

    if (isCorrect) setScore((prev) => prev + 1);
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
    }
  };

  const endTestEarly = () => {
    setIsFinished(true);
  };

  if (!data.length) return <p>Loading...</p>;
  if (isFinished)
    return (
      <div>
        <h2>Hallen Split</h2>
        <h4>Test beendet!</h4>
        <p>Dein Ergebnis: <strong>{score} / {totalAnswered}</strong> Fragen wurden richtig beantwortet.</p>
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
