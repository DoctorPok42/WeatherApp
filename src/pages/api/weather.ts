import { NextApiRequest, NextApiResponse } from "next";

export default async function weather(req: NextApiRequest, res: NextApiResponse) {
  const { city } = req.body;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=yes`
    );

    const responseHistory = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${city}&days=3&aqi=no&alerts=no`
    );

    const data = await response.json();
    const dataHistory = await responseHistory.json();

    if (data.error) {
      res.status(400).json({ error: data.error.message });
      res.end();
      return;
    }

    res.status(200).json({ data, dataHistory });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
    res.end();
  }
}
