import React, { useState } from "react";
import Training from "./components/Training";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleGoBack = () => {
    setSelectedCategory("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Wissens-Trainings App</h1>
      {selectedCategory ? (
        <Training category={selectedCategory} goBack={handleGoBack} />
      ) : (
        <div>
          <button onClick={() => handleCategorySelect("sichere_arbeitsmethoden")}>
            Sichere Arbeitsmethoden
          </button>
          <button onClick={() => handleCategorySelect("hallen_split")}>
            Hallen Split
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
