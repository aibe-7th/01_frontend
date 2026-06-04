const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatGroq } = require('@langchain/groq');
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DEFAULT_SYSTEM_MESSAGE = '당신은 사용자의 대화 내용을 기억하고 대답하는 친절한 대화형 AI 동반자입니다.';

// ─────────────────────────────────────────────────────────────────────────────
// [현재 구현] 클라이언트 주도 메모리 방식
//   - 대화 히스토리를 브라우저 localStorage에 저장, 매 요청 시 전체 배열을 서버로 전송
//   - 서버는 무상태(stateless) 유지 → scale-out에 유리
//   - 단점: 히스토리 증가 시 payload 및 LLM 입력 토큰 비례 증가
//
// [대안 1] 서버 인메모리 방식 (LangChain BufferMemory / ConversationSummaryMemory)
//   - LangChain이 내부적으로 히스토리를 누적 관리
//   - ConversationSummaryMemory 사용 시 오래된 내용을 요약하여 토큰 절약 가능
//   - 단점: 서버 재시작 시 대화 소멸, 다중 인스턴스 환경에서 세션 불일치
//   예시 (BufferMemory):
//     const { BufferMemory } = require('langchain/memory');
//     const { ConversationChain } = require('langchain/chains');
//     const memoryStore = new Map();                                 // sessionId별 메모리 보관
//     const memory = memoryStore.get(sessionId) || new BufferMemory();
//     const chain = new ConversationChain({ llm: model, memory });
//     const result = await chain.invoke({ input: userMessage });
//     memoryStore.set(sessionId, memory);                           // 갱신된 메모리 저장
//
// [대안 2] DB / Redis 영구 저장 방식
//   - Redis(TTL 활용) 또는 PostgreSQL 등 외부 저장소에 세션별 히스토리 보관
//   - 서버 재시작·다중 인스턴스 모두 안전, 대화 이력 영구 보존 가능
//   - 단점: 인프라 추가 필요, 구현 복잡도 상승
// ─────────────────────────────────────────────────────────────────────────────

// 대화 내역 연동 API 엔드포인트
app.post('/api/chat', async function handleChatWithMemory(req, res) {
  const { messages, provider = 'gemini', systemMessage = DEFAULT_SYSTEM_MESSAGE } = req.body;
  console.log(`대화 요청을 받았습니다. 제공자: ${provider}, 대화 단계 수: ${messages?.length || 0}`);

  if (!messages || !Array.isArray(messages)) {
    console.warn('메시지 배열 형식이 누락되었거나 올바르지 않습니다.');
    return res.status(400).json({ error: 'messages 배열은 필수 값입니다.' });
  }

  let model;

  switch (true) {
    case (provider === 'gemini'): {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('GEMINI_API_KEY가 누락되었습니다.');
        return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되어 있지 않습니다.' });
      }
      model = new ChatGoogleGenerativeAI({
        apiKey,
        model: 'gemma-4-26b-a4b-it',
        temperature: 0.7,
      });
      break;
    }
    case (provider === 'groq'): {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        console.error('GROQ_API_KEY가 누락되었습니다.');
        return res.status(500).json({ error: 'GROQ_API_KEY가 설정되어 있지 않습니다.' });
      }
      model = new ChatGroq({
        apiKey,
        model: 'openai/gpt-oss-20b',
        temperature: 0.7,
      });
      break;
    }
    default:
      console.warn(`지원하지 않는 제공자입니다: ${provider}`);
      return res.status(400).json({ error: `지원하지 않는 제공자입니다: ${provider}` });
  }

  try {
    // 클라이언트로부터 온 히스토리를 LangChain 메시지 객체들로 변환
    // [세션 스토어 방식으로 전환 시]
    //   const sessionStore = new Map();                              // 서버 전역 선언
    //   const messages = sessionStore.get(sessionId) || [];         // 히스토리 조회
    //   messages.push({ role: 'user', content: userInput });        // 사용자 메시지 추가
    //   sessionStore.set(sessionId, messages);                      // 저장 후 이 배열로 조립
    const langChainMessages = [];

    // 프런트에서 전달받은 시스템 메시지 적용
    langChainMessages.push(new SystemMessage(systemMessage));

    messages.forEach(function (msg) {
      if (msg.role === 'user') {
        langChainMessages.push(new HumanMessage(msg.content));
      } else if (msg.role === 'assistant') {
        langChainMessages.push(new AIMessage(msg.content));
      }
    });

    console.log(`대화 맥락과 함께 모델 호출 중... (${provider})`);
    const response = await model.invoke(langChainMessages);
    const reply = Array.isArray(response.content)
      ? response.content.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join('')
      : response.content;

    console.log('모델 응답 성공:', reply.substring(0, 50) + '...');
    return res.json({ reply: reply });
  } catch (error) {
    console.error('대화 처리 에러 발생:', error);
    return res.status(500).json({ error: error.message || '대화 처리 중 오류가 발생했습니다.' });
  }
});

// 서버 구동
app.listen(PORT, function startServer() {
  console.log(`03_chat_memory 서버가 포트 ${PORT} 에서 실행 중입니다.`);
});
