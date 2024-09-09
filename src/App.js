import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
function App() {
  const [start, setStart] = useState("");
  const [news, setNews] = useState("");
  const [newsResponse, setNewsResponse] = useState("");
  const [showError, setShowError] = useState(false);
  const [showNewsResponse, setShowNewsResponse] = useState(false);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("News Prediction App");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = pageTitle; // Update the browser tab title
  }, [pageTitle]); // Run whenever pageTitle changes

  const backEndCheck = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/");
      if (response.data.res) {
        setStart(response.data.res);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    backEndCheck();
  }, []);

  const handleRequest = useCallback(async () => {
    setLoading(true);
    try {
      const url = "http://127.0.0.1:5000/news";
      const data = { news: news };
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.res) {
        setNewsResponse(response.data.res);
        setPageTitle(response.data.res);
        setShowNewsResponse(true);
      } else if (response.data.error) {
        setError(response.data.error);
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [news]);

  const submitNews = (event) => {
    event.preventDefault();
    if (news.length > 0) {
      handleRequest();
    } else {
      setShowError(true);
      setError("Please enter a news");
    }
  };

  return (
    <div className=" h-screen bg-slate-400 p-8 flex justify-center items-center">
      <div className="absolute inset-0 bg-pink-600 blur-3xl z-0 h-full"></div>
      <div className="flex justify-center relative z-10 p-2">
        <div className="bg-green bg-green-400 border-2 border-inherit shadow-lg p-4 h-auto min-w-64">
          <p className=" p-2 mb-8 font-serif text-center text-base font-semibold underline">
            News predicted web application
          </p>
          {showNewsResponse && (
            <div
              className={`flex justify-center items-center p-2 my-3 ${
                newsResponse === "true" ? "bg-sky-600" : "bg-red-600"
              } text-white`}
            >
              {newsResponse === "true" ? "True News" : "False News"}
            </div>
          )}
          {loading && <p className="p-2 my-3 text-left">Loading...</p>}
          <div className="flex flex-col justify-center">
            <textarea
              className="border-2 border-black h-32 w-96 p-1 resize-none"
              type="text"
              id="name"
              name="name"
              placeholder="type here..."
              value={news}
              onChange={(event) => setNews(event.target.value)}
              cols={40}
            >
              {" "}
            </textarea>
            {showError && (
              <p className="p-1 text-2xl font-mono font-extrabold text-center text-red-700">
                {error}
              </p>
            )}
            <button
              className="py-3 bg-orange-700 cursor-pointer hover:bg-orange-800 text-white my-2"
              onClick={(event) => submitNews(event)}
            >
              Submit
            </button>
          </div>
          <p className="p-2 mt-6 text-center text-blue-800">{start}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
