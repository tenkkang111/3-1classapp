const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: "http://localhost:3000", 
};

app.use(cors(corsOptions));


// 텍스트 파일 경로
const headlineFilePath = path.join(__dirname, 'headline.txt');

const schedulesDir = path.join(__dirname, 'schedules');

// 요일별 일정을 제공하는 엔드포인트
app.get('/api/schedule/:day', (req, res) => {
  const day = req.params.day.toLowerCase(); // 요일을 소문자로 변환
  const scheduleFilePath = path.join(schedulesDir, `${day}.json`);

  // 요청한 요일의 JSON 파일을 읽고 응답으로 전송
  fs.readFile(scheduleFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading schedule file for ${day}:`, err);
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.setHeader('Content-Type', 'application/json'); // JSON 형식으로 응답 설정
    res.send(data); // 파일 내용을 그대로 클라이언트에게 전송
  });
});

// 헤드라인을 제공하는 엔드포인트
app.get('/api/headline', (req, res) => {

  fs.readFile(headlineFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading headline file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ headline: data });
  });
});

app.get('/api/images', (req, res) => {
  const images = [
    { url: 'http://localhost:3001/image/img1.jpg' },
    { url: 'http://localhost:3001/image/img2.jpg' },
    { url: 'http://localhost:3001/image/img3.jpg' },
    { url: 'http://localhost:3001/image/img4.jpg' },
    { url: 'http://localhost:3001/image/img5.jpg' }
  ];

  res.json(images);
});

app.get('/image/:image_name', function (req, res){
  res.sendFile(__dirname + "/images/" + req.params.image_name)
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
