import React from "react";
import { useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";

const DiseaseForm = () => {
  const [output, setOutput] = useState("");
  const [imageSrc, setImageSrc] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    start_year: 0,
    location: ""
  });

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
    setIsLoading(true);

    console.log(formData);
    await axios
      .post("http://127.0.0.1:5000/get_pm25_data", {
        start_year: Number(formData.start_year),
        location: String(formData.location)
      })
      .then(function (response) {
        console.log(response);
        let newData = String(response.data.prediction);
        const formatted = newData.split("\n");
        console.log(formatted);
        console.log(newData);
        setOutput(formatted);
        console.log(output);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <form onSubmit={handleSubmit} class="w-full max-w-lg mx-auto py-10">
        <div className="mb-6 items-center">
        <label>Enter an year</label>
        <input type="number" id="start_year" name="start_year" value={formData.start_year} onChange={handleChange} />
        </div>
        <div className="mt-4 items-center">
        <label>Enter a location</label>
        <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
        </div>
        {imageSrc && (
          <div className="flex justify-center mt-6">
            <img src={imageSrc} alt="img" />
          </div>
        )}

        <div className="text-center mt-6">
          <button
            className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-48 ease-linear transition-all duration-150"
            type="submit"
          >
            {isLoading ? (
              <ReactLoading
                type="bars"
                color="#ffffff"
                height={25}
                width={25}
              />
            ) : (
              "Submit"
            )}
          </button>
        </div>

        {output ? (
          <div
            class="mt-2 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
            role="alert"
          >
            <span class="font-medium">Output:</span>
            {output.map((item) => {
              return <p>{item}</p>;
            })}
          </div>
        ) : (
          <div className="flex justify-center">
            <img src="https://res.cloudinary.com/sarveshp46/image/upload/v1673158646/nothing-here_w38mzj.webp" />
          </div>
        )}
      </form>
    </div>
  );
};

export default DiseaseForm;
