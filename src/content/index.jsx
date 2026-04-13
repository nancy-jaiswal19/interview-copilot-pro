import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const Overlay = () => {
  const [transcript, setTranscript] = useState('');
  const [suggestion, setSuggestion] = useState('Waiting...');
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);
  // This ref is the "Source of Truth" for the speech engine loop
  const isListeningRef = useRef(false);

  const toggleListening = () => {
    if (isListening) {
      console.log("🛑 STOPPING MIC");
      isListeningRef.current = false; // Prevents onend from restarting
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      console.log("🚀 STARTING MIC");
      isListeningRef.current = true;
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSuggestion("Browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log("🟢 MIC ACTIVE");
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("🟡 Mic session ended...");
      // Check the Ref, not the state, to see if we should reboot
      if (isListeningRef.current) {
        console.log("🔄 Auto-restarting for continuous listening...");
        try {
          recognition.start();
        } catch (e) {
          console.error("Auto-restart failed:", e);
        }
      }
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          console.log("🎯 Question Captured:", transcriptPart);
          setTranscript(transcriptPart);
          setSuggestion("Thinking...");

          // Send to background script (which handles the personalized Gemini call)
          chrome.runtime.sendMessage(
            { type: 'GET_AI_SUGGESTION', text: transcriptPart },
            (response) => {
              if (response?.success) {
                // Ensure we extract text regardless of response format
                const finalMsg = typeof response.answer === 'object' 
                  ? (response.answer.text || JSON.stringify(response.answer)) 
                  : response.answer;
                setSuggestion(finalMsg);
              } else {
                setSuggestion("Error: " + (response?.error || "Check API Key/Resume"));
              }
            }
          );
        } else {
          interimTranscript += transcriptPart;
        }
      }
      if (interimTranscript) setTranscript(interimTranscript);
    };

    recognition.onerror = (err) => {
      console.error("🔴 Mic Error:", err.error);
      if (err.error === 'not-allowed') {
        setIsListening(false);
        isListeningRef.current = false;
        setSuggestion("Mic permission denied.");
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Nancy's AI Interview Proxy</h3>
      
      <div style={styles.section}>
        <p style={styles.label}>Transcribed Speech:</p>
        <p style={styles.text}>{transcript || "Listening for your question..."}</p>
      </div>

      <div style={styles.section}>
        <p style={styles.label}>AI Suggested Response:</p>
        <div style={styles.suggestionBox}>
          <p style={styles.aiText}>{suggestion}</p>
        </div>
      </div>

      <button 
        onClick={toggleListening} 
        style={{
          ...styles.button, 
          backgroundColor: isListening ? '#ea4335' : '#4285f4'
        }}
      >
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>

      <div style={styles.footer}>
        {isListening && <span style={styles.pulse}>●</span>} 
        {isListening ? ' Continuous Mode Active' : ' Assistant Offline'}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed', top: '20px', right: '20px', width: '300px',
    backgroundColor: '#202124', color: 'white', padding: '15px',
    borderRadius: '12px', zIndex: 2147483647, border: '1px solid #3c4043',
    boxShadow: '0 12px 32px rgba(0,0,0,0.4)', fontFamily: '"Segoe UI", Tahoma, sans-serif'
  },
  title: { margin: '0 0 12px 0', fontSize: '16px', color: '#4285f4', fontWeight: 'bold' },
  section: { marginBottom: '12px', backgroundColor: '#303134', padding: '8px', borderRadius: '6px' },
  label: { fontSize: '9px', color: '#9aa0a6', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' },
  text: { fontSize: '12px', margin: 0, color: '#e8eaed', lineHeight: '1.4' },
  suggestionBox: { minHeight: '40px' },
  aiText: { fontSize: '13px', color: '#81c995', fontWeight: '500', margin: 0, lineHeight: '1.5' },
  button: { 
    width: '100%', padding: '10px', border: 'none', borderRadius: '6px', 
    color: 'white', cursor: 'pointer', fontWeight: 'bold', transition: 'background 0.2s' 
  },
  footer: { marginTop: '10px', fontSize: '10px', color: '#9aa0a6', textAlign: 'center' },
  pulse: { color: '#ea4335', marginRight: '5px', animation: 'blink 1s infinite' }
};

const init = () => {
  if (document.getElementById('ai-assistant-root')) return;
  const rootElement = document.createElement('div');
  rootElement.id = 'ai-assistant-root';
  document.body.appendChild(rootElement);
  const root = createRoot(rootElement);
  root.render(<Overlay />);
};

if (document.body) {
  init();
} else {
  window.addEventListener('DOMContentLoaded', init);
}

export default Overlay;