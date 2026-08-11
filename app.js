const MODEL = "gemini-2.0-flash";
const API_URL = (key) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;

const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveKeyBtn = document.getElementById("saveKeyBtn");

const history = [];

function getApiKey() {
  return localStorage.getItem("gemini_api_key") || "";
}

function setApiKey(key) {
  localStorage.setItem("gemini_api_key", key);
}

function addMessage(role, text) {
  const el = document.createElement("div");
  el.className = `message ${role}`;
  el.textContent = text;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return el;
}

settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hidden");
  apiKeyInput.value = getApiKey();
});

saveKeyBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    setApiKey(key);
    settingsPanel.classList.add("hidden");
  }
});

userInput.addEventListener("input", () => {
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;

  const apiKey = getApiKey();
  if (!apiKey) {
    addMessage("error", "먼저 오른쪽 위 ⚙️ 버튼을 눌러 Gemini API 키를 저장해주세요.");
    settingsPanel.classList.remove("hidden");
    return;
  }

  addMessage("user", text);
  history.push({ role: "user", parts: [{ text }] });
  userInput.value = "";
  userInput.style.height = "auto";
  sendBtn.disabled = true;

  const thinkingEl = addMessage("bot", "생각 중...");

  try {
    const res = await fetch(API_URL(apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `요청 실패 (${res.status})`);
    }

    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "(응답이 비어 있습니다)";

    thinkingEl.textContent = reply;
    history.push({ role: "model", parts: [{ text: reply }] });
  } catch (err) {
    thinkingEl.remove();
    addMessage("error", `오류: ${err.message}`);
    history.pop();
  } finally {
    sendBtn.disabled = false;
  }
});
