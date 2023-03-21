import React from "react";

// components

import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats({ headerText }) {
  return (
    <>
      {/* Header */}
      <div className="relative md:pt-32 pb-32 pt-12" style={{"backgroundColor":"#475569"}}>
        <div className="text-4xl text-white text-center font-semibold">
          {headerText}
        </div>
      </div>
    </>
  );
}
