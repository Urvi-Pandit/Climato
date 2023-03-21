import React from "react";
import Admin from "layouts/Admin.js";
import WeatherForm from "components/WeatherForm";

export default function Weather() {
  return (
    <Admin
      title="Temperature Prediction"
      headerText="Enter details to predict temperature"
    >
      <div className="flex flex-wrap mt-4 justify-center">
        <div className="w-full mb-12 xl:mb-0 px-4">
          <WeatherForm />
        </div>
      </div>
    </Admin>
  );
}
