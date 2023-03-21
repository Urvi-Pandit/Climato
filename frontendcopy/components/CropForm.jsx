import React from "react";
import { useState } from "react";
import axios from "axios";
import CardTable from "components/Cards/CardTable.js";
import CardLineChart from "./Cards/CardLineChart";


const CropForm = () => {
  const [formData, setFormData] = useState({
    Months: 0
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
      .post("http://127.0.0.1:5000/predictaqi", {
        Months: Number(formData.Months),
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
      Months: 12,
    });
  };
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      {/* <div className="flex items-center justify-center mt-5">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">

            </div>
            <div className="w-full md:w-1/2 px-3">

            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">

            </div>
            <div className="w-full md:w-1/2 px-3">

            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">

            </div>
            <div className="w-full md:w-1/2 px-3">

            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full md:w-2/2 px-3 mb-6 md:mb-0">

            </div>
          </div>
          <div className="flex flex-wrap justify-center mx-3 mb-2">
            <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded h-10">
              Submit
            </button>
          </div>
          {output && (
            <div
              class="mt-2 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
              role="alert"
            >
              <span class="font-medium">Recommended Crop: </span>
              {output}
            </div>
          )}
        </form>
      </div> */}
      
      <div className="flex-auto px-4 lg:px-10 py-10">
        <form onSubmit={handleSubmit}>
        <CardLineChart />
          <div className="grid grid-cols-2">

        
            <div className="mb-3 mr-2">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="Location"
              >
                Location
              </label>
              <input
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                id="Location"
                placeholder="Location"
                name="Location"
                // required
                onChange={handleChange}
                // value={formData.Location}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="mr-2 mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="PH"
              >
                Month
              </label>
              <input
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                id="PH"
                type="number"
                placeholder="Month"
                name="PH"
                required
                min="0"
                max="100"
                onChange={handleChange}
                value={formData.Months}
              />
            </div>
</div>

          <div className="text-center mt-6">
            <button
              className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              type="submit"
            >
              Submit
            </button>
          </div>

          {output ? (
            <div
              class="mt-2 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
              role="alert"
            >
              <CardTable output={output} />
            </div>
          ) : (
            <div className="flex justify-center">
              <img src="https://res.cloudinary.com/sarveshp46/image/upload/v1673158646/nothing-here_w38mzj.webp" />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CropForm;
