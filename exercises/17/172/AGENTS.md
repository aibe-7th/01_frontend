# Express + LangChainJS Agent 실습 가이드 및 규칙 (AGENTS.md)

본 프로젝트는 **Express**와 **LangChainJS**를 활용하여 LLM Agent를 단계별로 실습하고 학습하는 것을 목적으로 합니다.
실습 코드 작성 및 환경 구성 시, 아래의 개발 규칙 및 패턴을 반드시 준수해야 합니다.

---

## 1. 기본 개발 환경 및 기술 스택

### 📂 디렉터리 구조 및 번호별 관리
각 실습 단계(예시 번호)는 개별 폴더를 가지며, 각 폴더 내부에 백엔드 로직(`server.js`)과 프런트엔드 정적 파일(`public/`)을 분리하여 구성합니다.
```
├── package.json
├── .env
├── .env.example
├── 01/
│   ├── server.js (백엔드 코드)
│   └── public/
│       ├── index.html
│       └── script.js (프런트엔드 스크립트)
├── 02/
│   ├── server.js
│   └── public/
│       └── index.html (통합 HTML)
└── 03/
    ...
```

### 📦 패키지 및 모듈 관리
*   **패키지 매니저**: 반드시 `npm`을 사용하여 의존성을 관리합니다.
*   **모듈 시스템**: ESM (`import`/`export`) 대신 **CommonJS** 문법 (`require`/`module.exports`)을 사용합니다. (단, 프런트엔드 스크립트 제외)
    ```javascript
    // O (올바른 예 - 백엔드)
    const express = require('express');
    const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

    // X (잘못된 예 - 백엔드)
    // import express from 'express';
    ```
*   **Zod 사용 제한**: **Zod 라이브러리는 절대 사용하지 않습니다.** 구조화된 출력(Structured Output) 정의 시 라이브러리 의존성 없이 순수 **JSON Schema 객체**를 사용하여 스키마를 구성해야 합니다.
*   **스트리밍 배제 규칙**: **SSE(Server-Sent Events) 등의 스트리밍(.stream) 응답은 실습 예제에서 모두 제외합니다.** 비동기 및 스트리밍 처리 관련 오버헤드와 복잡성을 낮추어, 학생들이 체인과 에이전트 설계 핵심 로직(`.invoke()`)에 집중할 수 있도록 단순함을 유지합니다.

### ⚙️ 환경변수 관리
*   API 키와 서버 포트 등은 `dotenv` 패키지를 사용하여 프로젝트 루트의 `.env` 파일로부터 주입받아야 합니다.
*   실습 저장소에는 반드시 `.env.example` 파일을 포함하여 필요한 환경변수 목록을 공유합니다.

### 🏃‍♂️ 실행 스크립트 구조
*   실습은 단계별로 나누어 진행되며, 프로젝트 루트의 `package.json`에 각 실습 단계별 폴더 경로를 실행하는 스크립트를 정의합니다.
    ```json
    "scripts": {
      "01": "node 01/server.js",
      "02": "node 02/server.js",
      "03": "node 03/server.js"
    }
    ```

### 🌐 프런트엔드 연동
*   백엔드(`server.js`)에서 각 단계의 `public/` 디렉터리에 있는 정적 파일(HTML, CSS, JS)을 Express의 static 미들웨어를 통해 서빙하거나, 프런트엔드를 분리할 경우 CORS 미들웨어를 사용하여 전체(`/` 또는 `*`) 통신을 허용합니다.
*   **파일 분리 예외**: 실습용 짧은 예시의 경우, 굳이 별도로 CSS 및 JS 파일을 독립시키지 않고 HTML 파일 내에 스타일(`style`) 태그와 스크립트(`script`) 태그를 활용해 통합하여 작성할 수 있습니다.
    ```javascript
    app.use(express.static(path.join(__dirname, 'public')));
    // 또는
    const cors = require('cors');
    app.use(cors());
    ```

---

## 2. LLM 모델 선택 가이드

예시 코드나 실습 프로젝트에서 사용할 모델을 선택할 때 임의로 구형 모델을 사용하지 않고, 반드시 아래의 공식 문서를 참조하여 **최신 모델**을 파악하고 적용합니다.

*   **Google AI Studio (Gemini)**: [공식 가격 및 모델 문서](https://ai.google.dev/gemini-api/docs/pricing?hl=ko)
*   **Groq**: [Groq 지원 모델 목록](https://console.groq.com/docs/models)
*   **NVIDIA NIM**: [NIM API 모델 카탈로그](https://integrate.api.nvidia.com/v1/models)

### 💡 권장/선호 모델 목록 (2026년 기준)
*   **Gemini (Google AI Studio)**: `gemini-3.1-flash-lite` (기본 추천), `gemma-4-26b-a4b-it` (moe), `gemma-4-31b-it` (dense)
*   **Groq**: `openai/gpt-oss-20b` (기본 추천), `meta-llama/llama-4-scout-17b-16e-instruct`, `openai/gpt-oss-120b`, `qwen/qwen3-32b`
*   **NVIDIA NIM**: `deepseek-ai/deepseek-v4-flash` (기본 추천), `deepseek-ai/deepseek-v4-pro`

---

## 3. 코드 작성 규칙 (Coding Conventions)

### 🖥️ 프런트엔드 및 백엔드 JavaScript 공통 규칙
1.  **조건문 사용 규칙**: 
    *   단순 조기 리턴(예: `if (!message)`)이나 이진 분기(`if-else`)의 경우 standard **`if`** 또는 **`if-else`** 구문을 사용합니다.
    *   다중 조건 분기(기존의 복잡한 `else if`가 3개 이상 중첩되는 구조)가 발생할 때 가독성과 조건 확장의 편의성을 위해 **`switch (true)`** 구문 작성을 대체 안으로 권장합니다. 단순 조건문에 남발하지 않도록 주의합니다.
    ```javascript
    // 단순 조기 예외 차단 (standard if 사용)
    if (!message) {
      return res.status(400).json({ error: '메시지가 없습니다.' });
    }

    // 다중 조건 분기 (switch (true) 사용 권장)
    switch (true) {
      case (provider === 'gemini'):
        // Gemini 모델 로드
        break;
      case (provider === 'groq'):
        // Groq 모델 로드
        break;
      case (provider === 'nim'):
        // NIM 모델 로드
        break;
      default:
        // 기본 처리
    }
    ```

2.  **LLM 분류 및 출력 최적화 규칙**:
    *   분류(Classification) 작업 시 텍스트 단어(예: 'complaint', 'serious' 등)를 직접 반환하도록 유도하는 대신, 범주형(Categorical)으로 **1자리 숫자(예: 1, 2, 3)**를 출력하도록 프롬프트를 구성합니다.
    *   이때 LLM 호출 시 **`maxOutputTokens: 1`** (또는 `maxTokens: 1`) 제약을 부여하여 불필요한 사족 출력을 원천 차단하고 파싱 안정성을 확보합니다.

### 🖥️ 프런트엔드 JavaScript 규칙
가독성과 디버깅 편의성을 극대화하기 위해 클라이언트 사이드 스크립트는 다음 패턴을 따릅니다.

1.  **DOM 선택자**: `getElementById` 등 대신 `document.querySelector` 및 `document.querySelectorAll`을 우선하여 일관되게 사용합니다.
2.  **함수 정의**: 화살표 함수 표현식(`const fn = () => {}`)보다는 **함수 선언식**(`function fn() {}`)을 선호합니다.
3.  **코드 구조화**: 스크립트 내부에서 아래 영역이 명확하게 분리 및 뭉쳐져 있어야 합니다.
    *   **DOM 요소 캐싱 영역 (DOM Cache)**
    *   **이벤트 리스너 등록 영역 (Event Listeners)**
    *   **이벤트 핸들러 및 비즈니스 로직 영역 (Event Handlers / Actions)**
4.  **모듈화**: 하나의 거대한 함수로 작성하지 않고, 기능 단위로 적절히 함수를 쪼개어 가독성을 높입니다.
5.  **디버깅 및 예외 처리**:
    *   중요 흐름마다 진행 상황을 알 수 있도록 `console.log`를 적절히 작성합니다.
    *   네트워크 요청이나 DOM 조작 등 예외가 발생할 수 있는 모든 곳에 `try-catch` 블록을 작성합니다.
6.  **API 통신**:
    *   네트워크 요청 시 `fetch` API 대신 **axios** 라이브러리를 사용합니다.
    *   axios는 `script.js`에서 `import`로 가져오지 않고, `index.html`에서 CDN `<script>` 태그로 전역 로드합니다. `script.js`는 `type="module"` 없이 일반 스크립트로 연결합니다.
    ```html
    <!-- axios CDN -->
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <!-- script.js 연결 -->
    <script src="script.js"></script>
    ```
7.  **응답 마크다운 파싱 및 안전한 새니타이징 공통 표시**:
    *   LLM 응답 텍스트(마크다운 포함)를 프런트엔드에 렌더링할 때, **`marked`** 라이브러리를 활용하여 HTML로 변환합니다.
    *   동시에 XSS(크로스 사이트 스크립팅) 공격 방지를 위해 반드시 **`DOMPurify`** 라이브러리를 함께 연동하여 안전하게 새니타이징(`DOMPurify.sanitize(marked.parse(content))`)한 결과물만을 DOM에 주입(`innerHTML`)해야 합니다.

### 🎨 프런트엔드 CSS 및 레이아웃 규칙
1.  **복잡성 배제**: 너무 복잡하거나 비대한 커스텀 CSS 작성을 지양합니다.
2.  **프레임워크 활용**: 화면 구성 시 최소한의 **Bootstrap (CDN)**을 활용하여 기본적인 UI 컴포넌트 스타일을 유지합니다.
3.  **정렬 및 레이아웃**: 레이아웃 배치는 **Flexbox (`display: flex`)** 위주로 구성하여 단순하고 직관적인 구조를 만듭니다.

---

## 4. 실습 예시 코드 (Boilerplate Template)

위의 규칙을 모두 준수한 실습 1단계(Basic Chat)의 표준 예시 코드 구조입니다.

### 📝 [Backend] `01/server.js` (Express + CommonJS)
```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage } = require('@langchain/core/messages');

// 1. 루트 디렉터리의 환경변수 로드 (.env가 프로젝트 루트에 있을 시 path 설정)
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// 2. 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. API 라우터 정의
app.post('/api/chat', async function handleChatRequest(req, res) {
  const { message } = req.body;
  console.log(`요청을 받았습니다. 메시지 내용: ${message}`);

  // 단순 입출력 검증은 standard if 구문 사용
  if (!message) {
    console.warn('비어있는 메시지가 수신되었습니다.');
    return res.status(400).json({ error: '메시지 내용이 비어있습니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable is missing');
    return res.status(500).json({ error: '서버 환경변수 설정이 올바르지 않습니다.' });
  }

  try {
    // 선호 모델 gemini-3.1-flash-lite 사용 (또는 gemma-4-26b-a4b-it (moe), gemma-4-31b-it (dense) 사용 가능)
    const model = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemini-3.1-flash-lite', // 또는 'gemma-4-26b-a4b-it' (moe), 'gemma-4-31b-it' (dense)
      temperature: 0.7,
    });

    console.log('Gemini 모델을 호출하는 중...');
    const response = await model.invoke([new HumanMessage(message)]);
    
    console.log('모델 호출 성공');
    return res.json({ reply: response.content });
  } catch (error) {
    console.error('Gemini 모델 호출 중 오류가 발생했습니다:', error);
    return res.status(500).json({ error: 'LLM 응답 생성 중 오류가 발생했습니다.' });
  }
});

// 4. 서버 구동
app.listen(PORT, function startServer() {
  console.log(`서버가 포트 ${PORT} 에서 실행 중입니다.`);
});
```

### 📝 [Frontend] `01/public/script.js` (DOM 규칙 준수)
```javascript
// 1. DOM Cache (DOM 요소 캐싱)
const chatForm = document.querySelector('#chat-form');
const userInput = document.querySelector('#user-input');
const chatOutput = document.querySelector('#chat-output');
const submitButton = document.querySelector('#submit-btn');

// 2. Event Listeners (이벤트 리스너 등록)
chatForm.addEventListener('submit', handleFormSubmit);

// 3. Event Handlers & Logics (핸들러 및 로직)

// 폼 전송 이벤트 핸들러
function handleFormSubmit(event) {
  event.preventDefault();
  
  const message = userInput.value.trim();
  if (!message) {
    console.warn('입력 필드가 비어있어 전송을 중단합니다.');
    return;
  }
  
  console.log(`서버로 메시지를 전송합니다: ${message}`);
  
  // UI 비활성화 및 로딩 표시
  toggleLoadingState(true);
  appendMessageToOutput('User', message);
  
  // 서버와 통신 요청
  sendChatRequest(message);
}

// API 비동기 요청 함수
async function sendChatRequest(message) {
  try {
    const response = await axios.post('/api/chat', {
      message: message
    });
    
    console.log('서버로부터 응답을 받았습니다:', response.data);
    appendMessageToOutput('Agent', response.data.reply);
  } catch (error) {
    console.error('요청에 실패했습니다:', error);
    appendMessageToOutput('System Error', '서버 통신에 실패했습니다. 다시 시도해주세요.');
  } finally {
    toggleLoadingState(false);
    clearInputField();
  }
}

// UI 헬퍼 함수: 메시지 렌더링 (Marked & DOMPurify를 활용한 마크다운 파싱 및 안전한 새니타이징 공통 표시)
function appendMessageToOutput(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${sender.toLowerCase()}`;
  if (sender === 'Agent') {
    messageElement.innerHTML = `<strong>${sender}:</strong> ${DOMPurify.sanitize(marked.parse(text))}`;
  } else {
    const textWrapper = document.createElement('span');
    textWrapper.textContent = text;
    messageElement.innerHTML = `<strong>${sender}:</strong> `;
    messageElement.appendChild(textWrapper);
  }
  chatOutput.appendChild(messageElement);
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

// UI 헬퍼 함수: 입력 필드 클리어
function clearInputField() {
  userInput.value = '';
  userInput.focus();
}

// UI 헬퍼 함수: 로딩 상태 토글
function toggleLoadingState(isLoading) {
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = '전송';
  }
}
```