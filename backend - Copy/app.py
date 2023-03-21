from __future__ import print_function
import json
from flask_cors import CORS
from fpdf import FPDF
from flask import Flask, request, render_template
import numpy as np
import pickle
import pandas as pd
import requests
import io
import torch
from torchvision import transforms
import os
import openai
import datetime
from bs4 import BeautifulSoup
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)






# def WeatherPredictor(to_predict_list):
#     to_predict = np.array([to_predict_list])
#     loaded_model = pickle.load(open("models/weather.pkl", "rb"))
#     result = loaded_model.predict(to_predict)
#     return result[0]



# routing
@app.route("/", methods=["GET"])
def home():
    return "server started..."


@app.route("/forecast", methods=["POST"])
def forecast():
    # Get the user's location from the form
    location = request.json["location"]

    # Use the OpenWeatherMap API to get the weather forecast for the next 15 days
    api_key = "25a7391eb816518d0639ab3f83a31f42"
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={location}&cnt=15&appid={api_key}"
    response = requests.get(url)
    weather_data = response.json()

    # Extract the necessary information from the API response
    forecast = []
    for item in weather_data["list"]:
        forecast.append(
            {
                "date": item["dt_txt"],
                "temperature": item["main"]["temp"],
                "humidity": item["main"]["humidity"],
                "wind": item["wind"]["speed"],
            }
        )

    month = datetime.datetime.now().month
    hemisphere = "north"

    # Determine the season based on the month and hemisphere
    if (month >= 3 and month <= 6) and hemisphere == "north":
        climate = "summer"
    elif (month >= 7 and month <= 10) and hemisphere == "north":
        climate = "rainy"
    elif (
        month == 11 or month == 12 or month == 1 or month == 2
    ) and hemisphere == "north":
        climate = "winter"

    temperature = forecast[0]["temperature"]
    openai.api_key = "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"
    instructions = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"pollution conditions based on {temperature} kelvin and {climate} climate",
        max_tokens=1000,
        temperature=0,
    )
    analysis = instructions.choices[0].text
    forecast = json.dumps(forecast)
    # Return the forecast to the user
    return [forecast, analysis]


@app.route("/state-aqi", methods=["GET"])
def getaqi():
    # Define the API endpoint and API key
    endpoint = "http://api.airvisual.com/v2/city"
    api_key = "f1133a08-a56d-403e-b442-70ec4b37e71a"

    # Define the list of cities for which you want to retrieve PM2.5 data

    stateaqi = []

    # Loop over the list of cities and make an API call for each city
    # Build the API request URL
    url = f"{endpoint}?city=Mumbai&state=Maharashtra&country=India&key={api_key}"

    # Send the API request and retrieve the response
    response = requests.get(url)
    data = response.json()

    # Extract the PM2.5 data from the response
    pollution = data["data"]["current"]["pollution"]
    weather = data["data"]["current"]["weather"]

    # Print the PM2.5 data for the city
    print(f"{data}")
    stateaqi.append({"pollution":pollution})
    stateaqi.append({"weather":weather})

    stateaqi =  json.dumps(stateaqi)
    return [stateaqi]


@app.route("/cities-aqi", methods=["GET"])
def getaqiofcities():

    # Build the API request URL
    url = f"https://api.openaq.org/v2/cities?limit=100&page=1&offset=0&sort=asc&country_id=IN&order_by=city"

    # Send the API request and retrieve the response
    response = requests.get(url)
    data = response.json()
    return data['results']

@app.route("/get_pm25_data", methods=["POST"])
def get_pm25_data():
    city = request.json["location"]
    start_year = request.json["start_year"]


    # Use the OpenStreetMap Nominatim API to convert city name to latitude and longitude
    response = requests.get(f"https://nominatim.openstreetmap.org/search?q={city}&format=json")
    data = response.json()

    # Extract the latitude and longitude from the first result
    latitude = data[0]["lat"][:7]
    longitude = data[0]["lon"][:7]



    # return data
    start_year = int(start_year)
    end_year = start_year + 1;
    endpoint = f"https://api.openaq.org/v2/measurements?date_from={start_year}-01-01&date_to={end_year}-01-01&limit=9000&page=1&offset=0&sort=asc&parameter_id=2&coordinates={latitude}%2C{longitude}&radius=1000&country_id=IN"

    response = requests.get(endpoint)
    if response.status_code == 200:
        data = response.json()
        # results = data["results"]
        # return results
        # pm25_values = [result["value"] for result in results]
        # return pm25_values

        # Get PM2.5 values for each day between the specified date range
        pm25_values = {}
        for measurement in data['results']:
            date = measurement['date']['local'][:10]
            if date in pm25_values:
                pm25_values[date].append(measurement['value'])
            else:
                pm25_values[date] = [measurement['value']]

        # Average PM2.5 values for each day
        for date in pm25_values:
            pm25_values[date] = sum(pm25_values[date]) / len(pm25_values[date])

        return pm25_values
    else:
        return " There was an error ! May try again later"


@app.route("/getnews", methods=["GET"])
def getnews():
    api_key = "5e1392e4a78241adbf27393420e62ec2"
    base_url = "https://newsapi.org/v2/everything?"
    query = "environment+pollution+India"
    sources = "bbc-news,the-hindu,the-times-of-india,ndtv"
    language = "en"
    sortBy = "relevancy"
    pageSize = 100

    complete_url = f"{base_url}q={query}&sources={sources}&language={language}&sortBy={sortBy}&pageSize={pageSize}&apiKey={api_key}"

    response = requests.get(complete_url)
    news_data = response.json()
    articles = news_data.get("articles")

    return articles

@app.route("/predictaqi", methods=["POST"])
def predictaqi():

    model = pickle.load(open("model.pkl", "rb"))
    print('model loaded')
    data = request.get_json("Months")
    if(data==None):
        data = 10

   
    results = model.fit()
    prediction = results.get_forecast(steps=data, dynamic=True)

    output = prediction.predicted_mean
    return output




if __name__ == "__main__":
    app.run()