import axios from 'axios';

const weatherData = async (lat: Number, lon: Number) => {
  try {
    const apiKey = process.env.API_KEY;
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    return weather.data
  } catch (err) {
    console.error(err)
  }

}
 
export {
  weatherData,
};
