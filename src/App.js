import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Header() {
  return (
    <header className="header">
      <h1>MID IN</h1>
    </header>
  );
}

function Timetable(props) {
  return (
    <div className="timetable-container">
      {props.timetable.length > 0 ? (
        props.timetable.map((item, index) => (
          <div className="timetable-row" key={index}>
            <div>{item.교시}</div>
            <div>{item.과목}</div>
            <div>{item.해당학생}</div>
          </div>
        ))
      ) : (
        <h2>데이터 없음</h2>
      )}
    </div>
  );
}

function ImageSlider() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/images');
        const data = await response.json();
        const imageUrls = data.map(item => item.url);
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '30px',
    autoplay: true,
    autoplaySpeed: 10000,
    cssEase: 'linear'
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function Headline() {
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    const fetchHeadline = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/headline'); // API 주소를 여기에 넣어주세요
        const data = await response.json();
        setHeadline(data.headline);
      } catch (error) {
        console.error('Error fetching headline:', error);
        setHeadline("오늘의 주요 뉴스: 기사 제목");
      }
    };

    fetchHeadline();
  }, []);

  return (
    <div className="headline">
      <h2>{headline}</h2>
    </div>
  );
}

function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'f813d4c006fc5112a174c82c210070ad';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Changwon&appid=${apiKey}&units=metric`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <footer className="footer">
      <div className="right">
        현재 시간: {currentTime.toLocaleTimeString()}
      </div>
      <div className="right">
        {weather ? (
          <div>
            <div>현재 온도: {weather.main.temp}°C</div>
            <div>날씨: {weather.weather[0].description}</div>
          </div>
        ) : (
          <div>날씨 정보를 불러오는 중...</div>
        )}
      </div>
    </footer>
  );
}

function App() {
  const [timetable, setTimetable] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dayOfWeek] = useState(new Date().getDay());

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        let url = '';

        switch (dayOfWeek) {
          case 1: // Monday
            url = 'http://localhost:3001/api/schedule/monday';
            break;
          case 2: // Tuesday
            url = 'http://localhost:3001/api/schedule/Tuesday';
            break;
          case 3: // Wednesday
            url = 'http://localhost:3001/api/schedule/Wednesday';
            break;
          case 4: // Thursday
            url = 'http://localhost:3001/api/schedule/Thursday';
            break;
          case 5: // Friday
            url = 'http://localhost:3001/api/schedule/Friday';
            break;
          case 6: // Saturday
          case 0: // Sunday
            setTimetable([]);
            return;
          default:
            setTimetable([]);
            return;
        }

        const response = await fetch(url);
        const data = await response.json();
        setTimetable(data);
      } catch (error) {
        console.error('Error fetching timetable:', error);
        setTimetable([]);
      }
    };

    fetchTimetable();
  }, [dayOfWeek]);

  useEffect(() => {
    if (timetable.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => {
          if (prevIndex < timetable.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [timetable]);

  return (
    <div className="container">
      <Header />
      <Timetable timetable={timetable.slice(0, currentIndex + 1)} />
      <div className="line"></div>
      <div className="line"></div>
      <ImageSlider />
      <Headline />
      <div className="HeadLine"></div>
      <Footer />
    </div>
  );
}
export default App;
