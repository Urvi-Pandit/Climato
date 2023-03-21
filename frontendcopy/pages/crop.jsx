import React from "react";
import Admin from "layouts/Admin.js";
import CropForm from "components/CropForm";

export default function Crop() {
  return (
    <Admin
      title="AQI Prediction"
      headerText="Monthly AQI Prediction"
    >
      <div className="flex flex-wrap mt-4 justify-center">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <CropForm />
        </div>
      </div>
    </Admin>
  );
}
