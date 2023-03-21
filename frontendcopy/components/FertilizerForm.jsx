import React from "react";
import Layout from "./Layout";
import { useState } from "react";
import axios from "axios";

const FertilizerForm = () => {
  const [formData, setFormData] = useState({
    Location:"mumbai",
    Moist: 0,
    Soil: 0,
    Crop: 0,
    N: 0,
    K: 0,
    P: 0,
  });
  const [output, setOutput] = useState(null);
  const handleChange = (event) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    let data = null;

    await axios
      .post("http://127.0.0.1:5000/fertilizer-predict", {
        Moist: Number(formData.Moist),
        location: formData.Location,
        Soil: Number(formData.Soil),
        Crop: Number(formData.Crop),
        N: Number(formData.N),
        K: Number(formData.K),
        P: Number(formData.P),
      })
      .then(function (response) {
        data = response.data;
        console.log(data);
        setOutput(data);
        console.log(output);
      })
      .catch(function (error) {
        console.log(error);
      });
    setFormData({
      Location: formData.Location,
      Moist: 0,
      Soil: 0,
      Crop: 0,
      N: 0,
      K: 0,
      P: 0,
    });
  };
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
     <img src='https://www.pranaair.com/wp-content/uploads/2019/07/How-to-Check-Air-Quality-Index-in-Your-Area.png'
                    alt="India AQI map" />
    </div>
  );
};

export default FertilizerForm;
