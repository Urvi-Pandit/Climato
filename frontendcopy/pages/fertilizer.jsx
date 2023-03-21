import React from "react";
import Admin from "layouts/Admin.js";
import FertilizerForm from "components/FertilizerForm";

export default function Fertilizer() {
  return (
    <Admin
      title="India AQI"
      headerText="Citywise AQI of India"
    >
      <div className="flex flex-wrap mt-4 justify-center">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <FertilizerForm />
        </div>
      </div>
    </Admin>
  );
}
