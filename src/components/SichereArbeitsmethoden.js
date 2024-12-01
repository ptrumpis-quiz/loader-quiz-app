import React, { useState, useEffect } from "react";

function SichereArbeitsmethoden() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    import("../data/sichere_arbeitsmethoden.json").then((module) => {
      setData(module.default);
    });
  }, []);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  const checkAnswers = () => {
    if (answered) return;
    setAnswered(true);

    const currentQuestion = data[currentIndex];
    const correctAnswers = currentQuestion.correctAnswers.map((ans) =>
      ans.toLowerCase().trim()
    );
    const userInput = userAnswers.map((ans) => ans.toLowerCase().trim());

    let isCorrect = false;
    let points = 0;

    if (currentQuestion.strictOrder) {
      isCorrect = JSON.stringify(userInput) === JSON.stringify(correctAnswers);
      points = isCorrect ? correctAnswers.length : 0;
    } else {
      points = userInput.reduce((sum, answer) => {
        return sum + (correctAnswers.includes(answer) ? 1 : 0);
      }, 0);
      isCorrect = points === correctAnswers.length;
    }

    setScore((prev) => prev + points);
    setFeedback(isCorrect ? "Richtig" : "Falsch");
  };

  const nextQuestion = () => {
    setAnswered(false);
    if (currentIndex + 1 === data.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswers([]);
      setFeedback("");
    }
  };

  if (!data.length) return <p>Loading...</p>;
  if (isFinished)
    return (
      <div>
        <h2>Sichere Arbeitsmethoden</h2>
        <h4>Training abgeschlossen!</h4>
        <p>Dein Ergebnis: <strong>{score} Punkte</strong></p>
      </div>
    );

  const currentQuestion = data[currentIndex];

  return (
    <div>
      <h2>Sichere Arbeitsmethoden</h2>
      <div style={{ marginTop: "40px" }}></div>
      <h3>{currentQuestion.question}</h3>
      <div>
        {Array(currentQuestion.correctAnswers.length)
          .fill("")
          .map((_, index) => (
            <input
              key={index}
              type="text"
              value={userAnswers[index] || ""}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              placeholder={`Antwort ${index + 1}`}
            />
          ))}
      </div>
      <button onClick={checkAnswers} disabled={answered}>
        Überprüfen
      </button>
      {feedback && (
        <div>
          <p style={{ color: feedback === "Richtig" ? "green" : "red" }}>
            {feedback}
          </p>
          {feedback && <button onClick={nextQuestion}>Nächste Frage</button>}
        </div>
      )}
    </div>
  );
}

export default SichereArbeitsmethoden;
