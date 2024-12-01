import React, { useState, useEffect } from "react";

function HallenSplit() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    import("../data/hallen_split.json").then((module) => {
      setData(module.default.sort(() => Math.random() - 0.5));
    });
  }, []);

  const checkAnswer = (userAnswer) => {
    const currentQuestion = data[currentIndex];
    const correctAnswers = currentQuestion.correctAnswers.map((ans) =>
      ans.toLowerCase().trim()
    );
    const isCorrect = correctAnswers.includes(userAnswer.toLowerCase().trim());

    if (isCorrect) setScore((prev) => prev + 1);
    setTotalAnswered((prev) => prev + 1);

    if (currentIndex + 1 === data.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const endTestEarly = () => {
    setIsFinished(true);
  };

  if (!data.length) return <p>Loading...</p>;
  if (isFinished)
    return (
      <div>
        <h2>Hallen Split Training abgeschlossen!</h2>
        <p>Dein Ergebnis: {score} / {totalAnswered}</p>
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
          <button key={option} onClick={() => checkAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
      <button onClick={endTestEarly} style={{ marginTop: "60px" }}>
        Test beenden
      </button>
    </div>
  );
}

export default HallenSplit;
