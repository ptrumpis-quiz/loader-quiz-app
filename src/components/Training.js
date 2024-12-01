import React, { useState } from "react";
import SichereArbeitsmethoden from "./SichereArbeitsmethoden";
import HallenSplit from "./HallenSplit";

function Training({ category, goBack }) {
  return (
    <div style={{ paddingRight: "20px" }}>
      <button onClick={goBack}>Zurück</button>
      {category === "sichere_arbeitsmethoden" && <SichereArbeitsmethoden />}
      {category === "hallen_split" && <HallenSplit />}
    </div>
  );
}

export default Training;
