import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// You must set the worker source for PDF.js to work
pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('pdf.worker.min.js');

const Popup = () => {
  const [apiKey, setApiKey] = useState('');
  const [modelType, setModelType] = useState('gemini');
  const [resumeData, setResumeData] = useState(''); // New state for Resume
  const [status, setStatus] = useState('');
  const [useStar, setUseStar] = useState(false);

  useEffect(() => {
    // Fetch all three pieces of data on load
    chrome.storage.local.get(['apiKey', 'modelType', 'resumeData', 'useStar'], (result) => {
      if (result.apiKey) setApiKey(result.apiKey);
      if (result.modelType) setModelType(result.modelType);
      if (result.resumeData) setResumeData(result.resumeData);
      if (result.useStar !== undefined) setUseStar(result.useStar);
    });
  }, []);


  // Handle File Upload (converts .txt file to string)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      setStatus('⏳ Processing PDF...');
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";

        // Loop through every page to get text
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          fullText += pageText + "\n";
        }

        setResumeData(fullText);
        setStatus('✅ PDF Imported!');
      } catch (err) {
        console.error(err);
        setStatus('❌ PDF Error');
      }
    } else {
      // Fallback for .txt files
      const reader = new FileReader();
      reader.onload = (event) => setResumeData(event.target.result);
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    chrome.storage.local.set({ apiKey, modelType, resumeData, useStar }, () => {
      setStatus('✅ Configuration Saved!');
      setTimeout(() => setStatus(''), 2000);
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>AI Assistant Settings</h2>
      
      <label style={styles.label}>Select AI Provider:</label>
      <select 
        value={modelType} 
        onChange={(e) => setModelType(e.target.value)}
        style={styles.input}
      >
        <option value="gemini">Google Gemini (Free Tier)</option>
        <option value="openai">OpenAI (ChatGPT)</option>
      </select>

      <label style={styles.label}>{modelType === 'gemini' ? 'Gemini' : 'OpenAI'} API Key:</label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key..."
        style={styles.input}
      />

      <label style={{...styles.label, display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
        <input 
          type="checkbox" 
          checked={useStar} 
          onChange={(e) => setUseStar(e.target.checked)} 
          style={{marginRight: '10px'}}
        />
        Use STAR Framework for answers
      </label>

      {/* --- New Resume Upload Section --- */}
      <label style={styles.label}>Upload Resume (.txt or .pdf) or Paste Below:</label>
      <input 
        type="file" 
        accept=".txt,.pdf" 
        onChange={handleFileUpload} 
        style={{...styles.input, fontSize: '11px', padding: '5px'}} 
      />
      
      <textarea
        value={resumeData}
        onChange={(e) => setResumeData(e.target.value)}
        placeholder="Paste resume content or summary here..."
        style={styles.textarea}
      />
      {/* ---------------------------------- */}

      <button onClick={handleSave} style={styles.button}>Save Configuration</button>
      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
};

const styles = {
  container: { width: '300px', padding: '20px', backgroundColor: '#202124', color: 'white', fontFamily: 'sans-serif' },
  title: { fontSize: '18px', margin: '0 0 15px 0', color: '#4285f4' },
  label: { display: 'block', fontSize: '11px', marginBottom: '5px', color: '#9aa0a6', marginTop: '10px' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3c4043', backgroundColor: '#303134', color: 'white', marginBottom: '10px', boxSizing: 'border-box' },
  textarea: { 
    width: '100%', height: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #3c4043', 
    backgroundColor: '#303134', color: 'white', marginBottom: '15px', resize: 'none', fontSize: '12px', boxSizing: 'border-box' 
  },
  button: { width: '100%', padding: '10px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  status: { fontSize: '12px', textAlign: 'center', marginTop: '10px', color: '#81c995' }
};

export default Popup;