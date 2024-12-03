import React, { useState, useEffect } from "react";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function HallenSplit({ dataFile = "hallen_split.json", options = ["Halle 4", "Halle 7", "Fracht West", "Embargo"] }) {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [isRepetition, setIsRepetition] = useState(false);

  useEffect(() => {
    import(`../data/${dataFile}`).then((module) => {
      const shuffledData = shuffleArray([...module.default]);
      setOriginalData([...module.default]);
      setData(shuffledData);
    });
  }, [dataFile]);
  

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
        { question: currentQuestion.question, correctAnswers: correctAnswers }
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
    const shuffledData = shuffleArray(originalData);
    setData(shuffledData);
    setIsFinished(false);
    setIsRepetition(false);
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setFeedback("");
    setAnswered(false);
    setCorrectAnswer("");
    setWrongAnswers([]);
  };

  const startRepititionMode = () => {
    setData(wrongAnswers);
    setIsFinished(false);
    setIsRepetition(true);
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
            <h4>Falsch beantwortete Fragen:</h4>
            <ul>
              {wrongAnswers.map((item, index) => (
                <li key={index} className={item.correctAnswers.join(", ").toLowerCase().replace(" ", "-")}>
                  <strong>{item.question}</strong> = <strong>{item.correctAnswers.join(", ")}</strong>
                </li>
              ))}
            </ul>
            <button onClick={startRepititionMode}>
              Fehlerhafte Antworten trainieren
            </button>
          </div>
        )}
        <button onClick={restartTest}>Test wiederholen</button>
      </div>
    );

  const currentQuestion = data[currentIndex];

  return (
    <div>
      <h2>Hallen Split {isRepetition && "(Wiederholung)"}</h2>
      <p>In welcher Halle wird das Paket sortiert?</p>
      <div style={{ marginTop: "40px" }}></div>
      <h3 style={{ marginLeft: "100px" }}>{currentQuestion.question}</h3>
      <div>
        {options.map((option) => (
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
            <p style={{ color: "green" }}>
              Richtig wäre: <strong>{currentQuestion.question} = {correctAnswer}</strong>
            </p>
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
