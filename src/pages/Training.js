import React, { useState } from "react";
import SichereArbeitsmethoden from "./SichereArbeitsmethoden";
import HallenSplit from "./HallenSplit";

function Training({ category, goBack }) {
  return (
    <div style={{ paddingRight: "20px" }}>
      <button onClick={goBack}>Zurück</button>
      {category === "sichere_arbeitsmethoden" && <SichereArbeitsmethoden />}
      {category === "hallen_split" && <HallenSplit dataFile="hallen_split.json" options={["Halle 4", "Halle 7", "Fracht West", "Embargo"]} />}
      {category === "hallen_split_plz" && <HallenSplit dataFile="hallen_split_plz.json" options={["Halle 4", "Fracht West"]} />}
    </div>
  );
}

export default Training;
