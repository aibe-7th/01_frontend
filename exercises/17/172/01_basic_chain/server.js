const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
// Provider
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatGroq } = require('@langchain/groq');
const { ChatOpenAI } = require('@langchain/openai');
// LangChain
const { HumanMessage } = require('@langchain/core/messages');
const { PromptTemplate } = require('@langchain/core/prompts');

// 해당 폴더 내의 로컬 .env 파일에서 환경변수 로드
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 및 JSON 파싱 활성화
app.use(cors());
app.use(express.json());

// 'public' 폴더에서 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

// 제공자에 따른 모델 초기화 헬퍼 함수
function getModel(provider) {
  const temperature = 0.7;

  // 다중 분기는 switch (true) 활용
  switch (true) {
    case (provider === 'gemini'):
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
      }
      return new ChatGoogleGenerativeAI({
        apiKey: geminiKey,
        model: 'gemma-4-26b-a4b-it',
        temperature,
      });

    case (provider === 'groq'):
      const groqKey = process.env.GROQ_API_KEY;
      if (!groqKey) {
        throw new Error('GROQ_API_KEY가 설정되지 않았습니다.');
      }
      return new ChatGroq({
        apiKey: groqKey,
        model: 'openai/gpt-oss-20b',
        temperature,
      });

    case (provider === 'nim'):
      const nimKey = process.env.NVIDIA_API_KEY;
      if (!nimKey) {
        throw new Error('NVIDIA_API_KEY가 설정되지 않았습니다.');
      }
      return new ChatOpenAI({
        apiKey: nimKey,
        configuration: {
          baseURL: 'https://integrate.api.nvidia.com/v1',
        },
        model: 'deepseek-ai/deepseek-v4-flash',
        temperature,
      });

    default:
      throw new Error('지원하지 않는 LLM 제공자입니다: ' + provider);
  }
}

// Invoke 엔드포인트 (동기 응답)
app.post('/api/chat', async function handleChat(req, res) {
  const { provider, message } = req.body;
  console.log(`요청을 받았습니다. 제공자: ${provider}, 메시지 내용: ${message}`);

  // 단순 조건 검증은 standard if 사용
  if (!provider || !message) {
    console.warn('제공자 또는 메시지가 누락되었습니다.');
    return res.status(400).json({ error: 'provider와 message는 필수 값입니다.' });
  }

  try {
    const model = getModel(provider);

    // PromptTemplate 생성 및 적용
    const promptTemplate = PromptTemplate.fromTemplate(
      "당신은 친절하고 전문적인 AI 학습 가이드입니다. 질문에 상세하게 답변해 주세요.\n질문: {question}"
    );
    const formattedPrompt = await promptTemplate.format({ question: message });

    console.log('모델 호출 중...');
    const response = await model.invoke([new HumanMessage(formattedPrompt)]);
    console.log('모델 호출 성공');

    const reply = Array.isArray(response.content)
      ? response.content.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join('')
      : response.content;
    return res.json({ reply: reply });

  } catch (error) {
    console.error('모델 호출 중 오류 발생:', error);
    return res.status(500).json({ error: error.message || 'LLM 호출 중 오류가 발생했습니다.' });
  }
});

// 서버 구동
app.listen(PORT, function startServer() {
  console.log(`01_basic_chain 서버가 포트 ${PORT} 에서 실행 중입니다.`);
});
