const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage } = require('@langchain/core/messages');

// 해당 폴더 내의 로컬 .env 파일에서 환경변수 로드
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 및 JSON 파싱 활성화
app.use(cors());
app.use(express.json());

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

// 장애 복구(Fallback) 테스트 엔드포인트
app.post('/api/fallback-chat', async function handleFallback(req, res) {
  const { message } = req.body;
  console.log(`장애 복구 요청을 받았습니다. 질문 내용: "${message}"`);

  if (!message) {
    console.warn('질문 텍스트가 누락되었습니다.');
    return res.status(400).json({ error: 'message는 필수 값입니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY가 누락되었습니다.');
    return res.status(500).json({ error: '서버 환경변수 설정이 올바르지 않습니다.' });
  }

  try {
    // 1. 에러를 강제로 유발할 잘못된 모델 생성 (잘못된 모델명 지정)
    console.log('1. 일부러 에러를 내기 위해 잘못된 설정을 가진 주 모델 인스턴스 생성');
    const primaryBadModel = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemini-non-existent-fake-model-name', // 존재하지 않는 모델명
      maxRetries: 0, // 빠른 테스팅을 위해 재시도 횟수를 0으로 명시
      temperature: 0.7,
    });

    // 2. 정상 작동할 백업용 서브 모델 생성
    console.log('2. 정상 작동할 백업용 부 모델 인스턴스 생성 (gemma-4-26b-a4b-it)');
    const fallbackGoodModel = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemma-4-26b-a4b-it',
      temperature: 0.7,
    });

    // 3. .withFallbacks()를 활용해 장애 복구 체인 생성
    // 주 모델이 에러를 던지면 백업 모델로 즉시 전환
    console.log('3. .withFallbacks() 옵션을 적용하여 자동 전환 체인 구성');
    const fallbackChain = primaryBadModel.withFallbacks([fallbackGoodModel]);

    console.log('4. 체인 호출 실행 (주 모델 장애 유발 -> 자동 백업 모델 호출)');
    const response = await fallbackChain.invoke([new HumanMessage(message)]);

    console.log('장애 극복 및 답변 생성 성공');

    // 프런트엔드에서 로그 진행 상황을 시각화할 수 있도록 처리 이력 로그도 같이 반환
    return res.json({
      reply: Array.isArray(response.content)
        ? response.content.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join('')
        : response.content,

      executionLogs: [
        '주 모델(gemini-non-existent-fake-model-name) 호출 시도 중...',
        '주 모델 호출 실패 (404/Invalid Model Name API 에러 감지)',
        '에러 감지 후 백업 모델(gemma-4-26b-a4b-it)로 자동 전환(Failover) 실행',
        '백업 모델 호출 완료 및 답변 추출 성공'
      ]
    });
  } catch (error) {
    console.error('체인 복구 도중 최종 에러 발생:', error);
    return res.status(500).json({ error: '백업 모델 마저 작동에 실패했습니다: ' + error.message });
  }
});

// 서버 구동
app.listen(PORT, function startServer() {
  console.log(`04_fallback_retry 서버가 포트 ${PORT} 에서 실행 중입니다.`);
});
