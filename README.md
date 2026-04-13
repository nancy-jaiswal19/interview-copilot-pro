# 🚀 Interview Copilot Pro

### Real-Time AI Assistant for Technical Interviews

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Extension](https://img.shields.io/badge/Platform-Chrome%20Extension-blue)](https://developer.chrome.com/docs/extensions/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)

---

## 🎥 Demo

![Demo GIF](./assets/demo.gif)

---

## 📌 Overview

**Interview Copilot Pro** is a production-ready Chrome Extension that provides **real-time AI-powered assistance during technical interviews**.

It captures interviewer questions, processes them instantly using LLMs, and generates **structured, context-aware responses** tailored to the user's resume.

Designed for platforms like **Google Meet** and **Zoom**, it helps candidates think clearly and respond confidently under pressure.

---

## ⚡ What Makes It Powerful?

* Real-time answer generation during interviews
* Resume-aware contextual responses
* Reduces thinking pressure in high-stakes situations
* Structured answers using STAR method

---

## ✨ Features

### 🎙️ Real-Time Transcription

* Uses **Web Speech API** for low-latency voice-to-text
* Captures interviewer questions instantly

### 📄 Resume-Aware Intelligence

* Upload your resume (PDF)
* Extracts and injects **project + skill context** into responses

### ⭐ STAR-Based Answer Generation

* Automatically structures responses using:

  * **Situation**
  * **Task**
  * **Action**
  * **Result**

### 🛡️ Non-Intrusive UI Overlay

* Floating React-based interface
* Works seamlessly over meeting platforms

### 🔒 Privacy First

* No audio recording stored
* Data processed securely via APIs
* Global ON/OFF toggle for full control

---

## 🧠 How It Works

```text
User Speech → Transcription → AI Processing → Context Injection → Smart Response
```

1. Captures live speech
2. Converts it into text
3. Sends query to LLM (Gemini/OpenAI)
4. Enhances with resume context (RAG)
5. Displays structured answer instantly

---

## 🛠️ Tech Stack

| Layer          | Technology                 |
| -------------- | -------------------------- |
| Frontend       | React.js, Tailwind CSS     |
| Extension      | Chrome Manifest V3         |
| AI Integration | OpenAI API / Google Gemini |
| Build Tool     | Vite                       |
| Storage        | Chrome Storage API         |
| PDF Processing | pdfjs-dist                 |

---

## 💡 Why This Project?

Technical interviews are high-pressure environments where candidates often struggle to structure answers clearly.

Interview Copilot Pro solves this by:

* Reducing thinking latency
* Structuring answers using STAR method
* Providing real-time AI assistance

This project demonstrates practical use of:

* Real-time systems
* AI integration
* Browser extension architecture

---

## ⚡ Challenges & Solutions

### 1. Real-Time Speech Processing

**Challenge:** Handling latency in speech-to-text
**Solution:** Used Web Speech API for near real-time transcription

### 2. Context-Aware AI Responses

**Challenge:** Generic AI answers
**Solution:** Implemented resume-based RAG using pdfjs

### 3. Overlay UI Stability

**Challenge:** Injecting UI without breaking meeting apps
**Solution:** Used isolated content scripts with React root injection

---

## 📁 Project Structure

```bash
src/
├── components/        # UI components
├── content-script/    # Injected UI logic
├── background/        # API handling
├── utils/             # Helper functions
├── resume-parser/     # PDF processing
└── App.jsx
```

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/nancy-jaiswal19/interview-copilot-pro.git
cd interview-copilot-pro
```

### 2. Install Dependencies

```bash
npm install
npm install pdfjs-dist lucide-react clsx tailwind-merge
```

### 3. Build Extension

```bash
npm run build
```

### 4. Load into Chrome

1. Open `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `dist` folder

---

## 🔑 Environment Variables

Create a `.env` file in root:

```env
VITE_OPENAI_API_KEY=your_api_key
VITE_GEMINI_API_KEY=your_api_key (optional)
```

> ⚠️ Never commit your API keys

---

## 🧪 Use Cases

* Technical Interviews (DSA, Projects)
* HR Interviews (Behavioral Questions)
* Mock Interview Practice

---

## 📚 Learnings

* Built a Chrome Extension using Manifest V3
* Implemented real-time AI pipelines
* Learned RAG (Retrieval-Augmented Generation)
* Improved React architecture for extensions

---

## 🗣️ How to Explain This Project

"I built a Chrome Extension that uses real-time speech recognition and LLM APIs to assist users during technical interviews. It captures interviewer questions, processes them using AI, and generates structured responses using the STAR method, enhanced with resume-based context using RAG."

---

## 🔍 Keywords

Chrome Extension, Real-Time Systems, AI Integration, Web Speech API, RAG, React.js, Tailwind CSS, Manifest V3

---

## 🚧 Future Improvements

* Multi-language support
* Offline fallback suggestions
* Interview performance analytics
* Code editor integration for DSA rounds

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**

---

## 👩‍💻 Author

**Nancy Jaiswal**
Built with focus, consistency, and real-world problem solving 💡

---

## ⭐ Support

If you found this project useful:

* Star ⭐ the repository
* Share it with others
* Use it to level up your interviews

---
