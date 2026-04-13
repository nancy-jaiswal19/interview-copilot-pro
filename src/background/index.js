chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 Received message in background:", message);

  if (message.type === 'GET_AI_SUGGESTION') {
    handleInference(message.text)
      .then(answerText => {
        console.log("📤 Sending answer string back:", answerText);
        // We wrap it here ONCE.
        sendResponse({ success: true, answer: answerText });
      })
      .catch(error => {
        console.error("❌ AI Error:", error);
        sendResponse({ success: false, error: error.message });
      });
      
    return true; 
  }
});

async function handleInference(text) {
  // 1. Fetch data (Added useStar to the destructuring)
  const { apiKey, modelType, resumeData, useStar } = await chrome.storage.local.get([
    'apiKey', 
    'modelType', 
    'resumeData',
    'useStar'
  ]);

  if (!apiKey) throw new Error("Missing API Key! Please set it in the extension popup.");

  // 2. Determine the strategy based on the STAR toggle
  const frameworkInstruction = useStar 
    ? "STRICT: Use the STAR framework (Situation, Task, Action, Result). Label each part (S:, T:, A:, R:)."
    : "STRICT: Provide a concise, high-impact 2-sentence answer.";

  const personalContext = resumeData 
    ? `The candidate's resume details are: ${resumeData}`
    : "The candidate is a skilled Software Developer and a student.";

  // 3. Construct the Final Personalized Prompt
  const personalizedPrompt = `
    SYSTEM: You are Nancy Jaiswal's expert interview proxy.
    CONTEXT: ${personalContext}
    QUESTION: "${text}"
    TASK: Answer the question in the first person ("I").
    ${frameworkInstruction}
    STRICT RULES:
    - Use specific projects like CodeSync Pro or Pathfinding Visualizer if relevant.
    - Do not give advice; speak as the candidate.
    - Keep it under 100 words.
  `;

  // 4. Route to the correct API (Now both use personalizedPrompt)
  if (modelType === 'openai') {
    return callOpenAI(personalizedPrompt, apiKey);
  } else {
    return callGemini(personalizedPrompt, apiKey);
  }
}



// Ensure your callGemini uses the 'personalizedPrompt' passed in
async function callGemini(fullPrompt, key) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${key}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }] // We pass the full personalized prompt here
      }]
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.candidates[0].content.parts[0].text;
}


async function callOpenAI(fullPrompt, key) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${key}` 
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // Cost-effective for quick interview hints
      messages: [{ role: "system", content: fullPrompt }]
    })
  });
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  return data.choices[0].message.content;
}