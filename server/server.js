const express = require('express');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

let cachedTrainingData = null;

async function loadTrainingData() {
  // In dev: put ECHOBRAINS.docx in project root's /public folder
  const docxPath = path.join(__dirname, '..', 'public', 'ECHOBRAINS.docx');
  if (!fs.existsSync(docxPath)) {
    console.error('❌ ECHOBRAINS.docx not found in /public folder');
    return null;
  }
  try {
    const result = await mammoth.extractRawText({ path: docxPath });
    console.log('✅ ECHOBRAINS.docx loaded successfully');
    return result.value;
  } catch (err) {
    console.error('❌ Failed to read ECHOBRAINS.docx:', err.message);
    return null;
  }
}

app.get('/api/training-data', (req, res) => {
  if (!cachedTrainingData) {
    return res.status(503).json({ error: 'Training data unavailable. Check ECHOBRAINS.docx exists in /public folder.' });
  }
  res.json({ trainingData: cachedTrainingData });
});

loadTrainingData().then(data => {
  cachedTrainingData = data;
  app.listen(PORT, () => {
    console.log('🚀 Backend running at http://localhost:' + PORT);
  });
});