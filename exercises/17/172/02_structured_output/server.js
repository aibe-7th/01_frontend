const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatGroq } = require('@langchain/groq');
const { HumanMessage } = require('@langchain/core/messages');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Gemini용 순수 JSON Schema (withStructuredOutput에 직접 전달)
const geminiSchema = {
  type: 'object',
  properties: {
    sentiment: {
      type: 'string',
      enum: ['positive', 'negative', 'neutral'],
      description: '리뷰의 긍정(positive), 부정(negative), 중립(neutral) 감정 분석 결과'
    },
    summary: {
      type: 'string',
      description: '리뷰 내용을 한 문장으로 요약한 한국어 텍스트'
    },
    keywords: {
      type: 'array',
      items: { type: 'string' },
      description: '리뷰에서 추출한 핵심 키워드 3개'
    },
    isUrgent: {
      type: 'boolean',
      description: '환불 요구, 강한 불만 표출 등 즉각적인 조치나 고객 대응이 필요한 건인지 여부'
    }
  },
  required: ['sentiment', 'summary', 'keywords', 'isUrgent']
};

// Groq용 OpenAI-compatible Function Calling 포맷
const groqSchema = {
  name: 'analyze_review',
  description: '고객 리뷰를 분석하여 감정, 요약, 키워드 및 긴급성 여부를 추출합니다.',
  parameters: {
    type: 'object',
    properties: {
      sentiment: {
        type: 'string',
        enum: ['positive', 'negative', 'neutral'],
        description: '리뷰의 긍정(positive), 부정(negative), 중립(neutral) 감정 분석 결과'
      },
      summary: {
        type: 'string',
        description: '리뷰 내용을 한 문장으로 요약한 한국어 텍스트'
      },
      keywords: {
        type: 'array',
        items: { type: 'string' },
        description: '리뷰에서 추출한 핵심 키워드 3개'
      },
      isUrgent: {
        type: 'boolean',
        description: '환불 요구, 강한 불만 표출 등 즉각적인 조치나 고객 대응이 필요한 건인지 여부'
      }
    },
    required: ['sentiment', 'summary', 'keywords', 'isUrgent']
  }
};

// 구조화된 리뷰 분석 엔드포인트
app.post('/api/analyze', async function handleAnalyze(req, res) {
  const { review, provider = 'gemini' } = req.body;
  console.log(`리뷰 분석 요청을 받았습니다. 제공자: ${provider}, 분석 내용 길이: ${review?.length || 0}`);

  if (!review) {
    console.warn('분석할 리뷰 텍스트가 누락되었습니다.');
    return res.status(400).json({ error: 'review 텍스트는 필수 값입니다.' });
  }

  let model;
  let schema;

  switch (true) {
    case (provider === 'gemini'): {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('GEMINI_API_KEY가 누락되었습니다.');
        return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되어 있지 않습니다.' });
      }
      model = new ChatGoogleGenerativeAI({
        apiKey,
        model: 'gemma-4-31b-it',
        temperature: 0,
      });
      schema = geminiSchema;
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
        model: 'openai/gpt-oss-120b',
        temperature: 0,
      });
      schema = groqSchema;
      break;
    }
    default:
      console.warn(`지원하지 않는 제공자입니다: ${provider}`);
      return res.status(400).json({ error: `지원하지 않는 제공자입니다: ${provider}` });
  }

  try {
    console.log(`JSON Schema 바인딩 및 구조화된 모델 인스턴스 생성... (${provider})`);
    const structuredModel = model.withStructuredOutput(schema);

    console.log('모델 호출 및 리뷰 분석 중...');
    const result = await structuredModel.invoke([
      new HumanMessage(`다음 고객 리뷰를 객관적으로 분석해 주세요:\n"${review}"`)
    ]);

    console.log('구조화 분석 완료:', result);
    return res.json(result);
  } catch (error) {
    console.error('구조화 분석 에러 발생:', error);
    return res.status(500).json({ error: error.message || '리뷰 분석 중 오류가 발생했습니다.' });
  }
});

app.listen(PORT, function startServer() {
  console.log(`02_structured_output 서버가 포트 ${PORT} 에서 실행 중입니다.`);
});
