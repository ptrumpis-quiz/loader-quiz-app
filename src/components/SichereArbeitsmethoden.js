import React, { useState, useEffect } from "react";

function SichereArbeitsmethoden() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [detailedFeedback, setDetailedFeedback] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    import("../data/sichere_arbeitsmethoden.json").then((module) => {
      setData(module.default);
    });
  }, []);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value || "";
    setUserAnswers(newAnswers);
  };
  
  const checkAnswers = () => {
    if (answered) return;
    setAnswered(true);
  
    const currentQuestion = data[currentIndex];
    const correctAnswers = currentQuestion.correctAnswers.map((ans) =>
      ans.toLowerCase().trim()
    );
    const userInput = userAnswers.map((ans) =>
      (ans || "").toLowerCase().trim()
    );
  
    let points = 0;
    let feedbackDetails = [];
  
    if (currentQuestion.strictOrder) {
      const isCorrect = JSON.stringify(userInput) === JSON.stringify(correctAnswers);
      points = isCorrect ? correctAnswers.length : 0;
  
      feedbackDetails = correctAnswers.map((correctAnswer, index) => {
        const userAnswer = userInput[index] || "(keine Eingabe)";
        return {
          userAnswer,
          correctAnswer,
          isCorrect: userAnswer === correctAnswer,
        };
      });
    } else {
      const matchedAnswers = new Set();
  
      feedbackDetails = correctAnswers.map((correctAnswer, index) => {
        const userIndex = userInput.findIndex(
          (userAnswer, userAnswerIndex) => userAnswer === correctAnswer && !matchedAnswers.has(userAnswerIndex)
        );
  
        if (userIndex !== -1) {
          matchedAnswers.add(userIndex);
          points++;
          return {
            userAnswer: userInput[userIndex],
            correctAnswer,
            isCorrect: true,
          };
        } else {
          return {
            userAnswer: "(keine oder falsche Eingabe)",
            correctAnswer,
            isCorrect: false,
          };
        }
      });
    }
  
    setScore((prev) => prev + points);
    setDetailedFeedback(feedbackDetails);
    setFeedback(points === correctAnswers.length ? "Richtig" : "Falsch");
  };  

  const nextQuestion = () => {
    setAnswered(false);
    if (currentIndex + 1 === data.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswers([]);
      setFeedback("");
      setDetailedFeedback([]);
    }
  };

  const restartTraining = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setScore(0);
    setFeedback("");
    setDetailedFeedback([]);
    setIsFinished(false);
    setAnswered(false);
  };

  if (!data.length) return <p>Loading...</p>;

  const totalPoints = data.reduce((sum, question) => sum + question.correctAnswers.length, 0);

  if (isFinished)
    return (
      <div>
        <h2>Sichere Arbeitsmethoden</h2>
        <h4>Test abgeschlossen!</h4>
        <p>
          Dein Ergebnis: <strong>{score} / {totalPoints} Punkte</strong>
        </p>
        <button onClick={restartTraining}>Test wiederholen</button>
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
          {detailedFeedback.length > 0 && (
            <div>
              <h4>Antwortübersicht:</h4>
              <ul>
                {detailedFeedback.map((item, index) => (
                  <li key={index} style={{ color: item.isCorrect ? "green" : "red" }}>
                    {item.isCorrect ? (
                      `Richtig: ${item.userAnswer}`
                    ) : (
                      <>
                        Falsch: {item.userAnswer} (Richtig: {item.correctAnswer})
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button onClick={nextQuestion}>Nächste Frage</button>
        </div>
      )}
    </div>
  );
}

export default SichereArbeitsmethoden;
