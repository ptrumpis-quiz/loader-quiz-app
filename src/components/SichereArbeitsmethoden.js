import React, { useState, useEffect } from "react";

function SichereArbeitsmethoden() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

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
    const currentQuestion = data[currentIndex];
    const correctAnswers = currentQuestion.correctAnswers.map((ans) =>
      ans.toLowerCase().trim()
    );
    const userInput = userAnswers.map((ans) => ans.toLowerCase().trim());

        // Berechnung der Punkte für jede richtige Antwort
        let points = 0;

        if (currentQuestion.strictOrder) {
          // Strikte Reihenfolge: Alle müssen korrekt und in der richtigen Reihenfolge sein
          if (JSON.stringify(userInput) === JSON.stringify(correctAnswers)) {
            points = correctAnswers.length; // Volle Punktzahl
          }
        } else {
          // Unabhängige Reihenfolge: Zähle jede richtige Antwort
          points = userInput.reduce((sum, answer) => {
            return sum + (correctAnswers.includes(answer) ? 1 : 0);
          }, 0);
        }
    
        setScore((prev) => prev + points);
    
        // Fortschritt oder Abschluss des Trainings
        if (currentIndex + 1 === data.length) {
          setIsFinished(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setUserAnswers([]);
        }
      };

      if (!data.length) return <p>Loading...</p>;
      if (isFinished)
        return (
          <div>
            <h2>Sichere Arbeitsmethoden Training abgeschlossen!</h2>
            <p>Dein Ergebnis: {score} Punkte</p>
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
      <button onClick={checkAnswers}>Bestätigen</button>
    </div>
  );
}

export default SichereArbeitsmethoden;
