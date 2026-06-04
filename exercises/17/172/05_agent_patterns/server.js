const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatGroq } = require('@langchain/groq');
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

// 해당 폴더 내의 로컬 .env 파일에서 환경변수 로드
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 및 JSON 파싱 활성화
app.use(cors());
app.use(express.json());

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, 'public')));

// 에이전트 워크플로우 엔드포인트
app.post('/api/agent', async function handleAgent(req, res) {
  const { message } = req.body;
  console.log(`에이전트 요청 접수: "${message}"`);

  // 단순 입출력 검증은 standard if 사용
  if (!message) {
    console.warn('사용자 입력 메시지가 누락되었습니다.');
    return res.status(400).json({ error: 'message는 필수 값입니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY가 누락되었습니다.');
    return res.status(500).json({ error: '서버 환경변수 설정이 올바르지 않습니다.' });
  }

  // 실행 로그 수집용 배열
  const executionLogs = [];

  // content가 문자열 또는 콘텐츠 블록 배열일 수 있는 경우를 통일 처리하는 헬퍼
  function extractText(content) {
    if (Array.isArray(content)) {
      return content.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join('');
    }
    return content || '';
  }

  try {
    // 1. 기본 주 모델 생성 (Google Gemini)
    const model = new ChatGoogleGenerativeAI({
      apiKey,
      model: 'gemma-4-26b-a4b-it', // 주 모델로 26b (gemma-4-26b-a4b-it) 사용
      temperature: 0, // 안정적인 분류 및 예측을 위해 0으로 설정
    });

    // 2. 모델 간 앙상블을 위한 모델 후보 목록 구축 (키 존재 시 인스턴스화)
    const activeModelsForEnsemble = [];
    
    activeModelsForEnsemble.push({
      name: 'Google Gemini (gemma-4-26b-a4b-it)',
      instance: model
    });

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      activeModelsForEnsemble.push({
        name: 'Groq (openai/gpt-oss-20b)',
        instance: new ChatGroq({
          apiKey: groqKey,
          model: 'openai/gpt-oss-20b',
          temperature: 0
        })
      });
    }

    const nimKey = process.env.NVIDIA_API_KEY;
    if (nimKey) {
      activeModelsForEnsemble.push({
        name: 'NVIDIA NIM (deepseek-ai/deepseek-v4-flash)',
        instance: new ChatOpenAI({
          apiKey: nimKey,
          configuration: {
            baseURL: 'https://integrate.api.nvidia.com/v1',
          },
          model: 'deepseek-ai/deepseek-v4-flash',
          temperature: 0
        })
      });
    }

    // Node 1. 다중 분류 (Multi-class Classification)
    executionLogs.push('Node 1: 다중 분류(Multi-class Classification) 가동');
    console.log('입력 다중 분류 중...');

    const classificationPrompt = `
당신은 입력 라우팅 게이트웨이입니다. 사용자 질문을 분석하여 다음 세 범주 중 하나로 분류하고, 해당하는 숫자 1자리만 반환하십시오.
다른 설명이나 공백은 절대 추가하지 마십시오.

1: 제품 파손, 배송 불만, 환불 요구, 오배송 등 불만 사항 (complaint)
2: 사용법 문의, 기능 확인, 재고 확인, 가격 안내 등 질문 사항 (inquiry)
3: 일상 인사, 의미 없는 글자, 기타 단순 대화 (general)

사용자 입력: "${message}"
분류 결과(1, 2, 3 중 하나):`;

    const classificationResponse = await model.invoke([new HumanMessage(classificationPrompt)]);
    const categoryCode = (Array.isArray(classificationResponse.content)
      ? classificationResponse.content.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join('')
      : classificationResponse.content).trim();
    
    // 숫자 코드를 카테고리 단어로 매핑
    const categoryMap = { '1': 'complaint', '2': 'inquiry', '3': 'general' };
    const category = categoryMap[categoryCode] || 'general';

    executionLogs.push(`결과: 입력 카테고리가 [${category}]로 분류되었습니다.`);
    console.log(`다중 분류 결과: ${category} (코드: ${categoryCode})`);

    let finalReply = '';
    let isSerious = false;
    let dissatisfactionScore = 0;

    // Node 2. 조건부 라우팅 (Conditional Routing)
    switch (true) {
      case (category === 'complaint'):
        executionLogs.push('Node 2: [complaint] 라우팅 노드 진입');
        console.log('불만 처리 노드 진입');

        // 2-1. 모델 간 앙상블 기반 이진 분류 (Cross-Model Ensemble Binary Classification)
        executionLogs.push(`Node 2-1: 심각도 판단을 위한 모델 간 앙상블(Cross-Model Ensemble) 가동 (활성 모델 수: ${activeModelsForEnsemble.length}개)`);
        console.log('심각도 판단 모델 간 앙상블 투표 시작...');

        const votes = [];
        const voteLogs = [];

        const binaryPrompt = `
당신은 고객 불만의 심각성을 판단하는 안전 요원입니다. 다음 불만 글이 즉각적이고 특별한 조치가 필요한 '심각한 수준(1)'인지, 일반적인 수준의 불만족인 '일반 수준(2)'인지 분류하여 해당하는 숫자 1자리만 반환하십시오.
다른 설명이나 공백은 절대 추가하지 마십시오.

1: 법적 조치 언급, 신체적 피해, 심한 비속어, 고액 환불 요구 등 심각한 수준 (serious)
2: 그 외의 일반적인 불만 사항 (normal)

고객 불만: "${message}"
판단 결과(1 또는 2):`;

        // 활성화된 모델들에 대해 병렬 투표 진행 (오류 방지를 위해 개별 try-catch 처리)
        const votePromises = activeModelsForEnsemble.map(async function (item) {
          try {
            const response = await item.instance.invoke([new HumanMessage(binaryPrompt)]);
            const code = (Array.isArray(response.content)
              ? response.content.map(function (c) { return typeof c === 'string' ? c : (c.text || ''); }).join('')
              : response.content).trim();

            votes.push(code);
            voteLogs.push(`[${item.name}: ${code === '1' ? '심각' : '일반'}]`);
          } catch (err) {
            console.error(`${item.name} 호출 에러:`, err.message);
            voteLogs.push(`[${item.name}: 호출 실패/비활성]`);
          }
        });

        await Promise.all(votePromises);

        const validVotesCount = votes.length;
        if (validVotesCount === 0) {
          // 모든 모델 호출 실패 시 기본적으로 '일반(normal)'로 설정
          isSerious = false;
          executionLogs.push('모든 앙상블 모델 호출에 실패하여 기본 일반(normal)으로 설정합니다.');
        } else {
          const seriousVotes = votes.filter(v => v === '1').length;
          // 과반수 초과 투표가 1(심각)인지 판단 (과반수 초과 찬성 시 심각)
          isSerious = seriousVotes > (validVotesCount / 2);
          executionLogs.push(`앙상블 투표 현황: ${voteLogs.join(', ')}`);
          executionLogs.push(`결과: 다수결 판정 [${isSerious ? '심각(serious)' : '일반(normal)'}] (심각 투표 수: ${seriousVotes}/${validVotesCount})`);
        }
        console.log(`앙상블 판정 완료: ${isSerious ? 'serious' : 'normal'}`);

        // 2-2. 수치 예측 / 유사 회귀 (Numeric Prediction / Pseudo-regression)
        executionLogs.push('Node 2-2: 수치 예측(Numeric Prediction) 시작 (고객 불만 지수 예측)');
        const regressionPrompt = `
당신은 고객의 텍스트 뉘앙스를 분석하여 불만족 지수(Dissatisfaction Score)를 예측하는 통계 분석가입니다.
고객 불만족 지수를 0(매우 평온함)부터 100(극도로 분노함) 사이의 정수 하나로만 반환하십시오.
다른 설명은 완전히 생략하고 오직 숫자 하나만 반환해야 합니다.

고객 불만: "${message}"
불만족 지수 (0-100):`;
        const regressionResponse = await model.invoke([new HumanMessage(regressionPrompt)]);
        dissatisfactionScore = parseInt(extractText(regressionResponse.content).replace(/[^0-9]/g, ''), 10) || 50;
        executionLogs.push(`결과: 불만족 수치 지수 예측값 = [${dissatisfactionScore} / 100]`);

        // 2-3. 피드백 루프 (Feedback Loop / Evaluator-Optimizer)
        executionLogs.push('Node 2-3: 피드백 루프 작동 (평가자-최적화 답변 생성)');
        let iteration = 0;
        let meetsQuality = false;
        let draftResponse = '';
        let feedback = '';

        while (true) {
          if (iteration >= 2 || meetsQuality) {
            break;
          }

          iteration++;
          executionLogs.push(`루프 실행 [반복 회차: ${iteration}]`);
          console.log(`루프 반복 실행: ${iteration}회차`);

          // Generator 호출
          const generatorPrompt = `
당신은 친절한 고객 지원 매니저입니다. 고객 불만 내용에 대응하는 정중하고 상세한 사과 메일 초안을 작성해 주세요.
${feedback ? `이전 평가 피드백 수정 지침: "${feedback}"\n이전 초안을 이 지침에 맞춰 보완 및 수정하십시오.` : ''}
고객 불만: "${message}"
불만족 지수: ${dissatisfactionScore}
심각도: ${isSerious ? '심각' : '보통'}
답변 초안:`;

          const generatorResponse = await model.invoke([new HumanMessage(generatorPrompt)]);
          draftResponse = extractText(generatorResponse.content);
          executionLogs.push(`초안 생성 완료`);

          // Evaluator 호출 (품질 기준 검사)
          // 규칙: 불만족 수치(dissatisfactionScore)가 70점을 넘거나 심각도(isSerious)가 true인 경우 보상 대책(쿠폰, 환불, 교환 등)을 무조건 제시해야 함
          const evaluatorPrompt = `
당신은 고객 대응 품질 검수원입니다. 아래 답변 초안이 지정된 기준을 충족하는지 검수하십시오.

[품질 기준]
1. 불만족 지수가 70 이상이거나 심각도가 '심각'인 경우, 반드시 구체적인 '보상 조치'(환불 약속, 할인 쿠폰 제공, 무상 교환 등)가 제안되어 있어야 합니다.
(현재 불만족 지수: ${dissatisfactionScore}, 심각도: ${isSerious ? '심각' : '보통'})

위 기준을 완벽히 충족하면 다른 단어 없이 오직 'PASS'라고만 답변하십시오.
그렇지 않고 보상 대책 등이 빠졌거나 부족하다면 'FAIL: [부족한 사항 및 수정 피드백 내용]' 형식으로 상세하게 피드백을 한글로 반환하십시오.

답변 초안: "${draftResponse}"
평가 결과:`;

          const evaluatorResponse = await model.invoke([new HumanMessage(evaluatorPrompt)]);
          const evalResult = extractText(evaluatorResponse.content).trim();
          console.log(`평가 결과: ${evalResult}`);

          if (evalResult === 'PASS') {
            meetsQuality = true;
            executionLogs.push('품질 검사 통과 (PASS)');
          } else {
            meetsQuality = false;
            feedback = evalResult.replace('FAIL:', '').trim();
            executionLogs.push(`품질 검사 실패 (FAIL). 수정 요구: "${feedback}"`);
          }
        }

        finalReply = draftResponse;
        executionLogs.push('피드백 루프 종료 및 최종 메일 내용 확정');
        break;

      case (category === 'inquiry'):
        executionLogs.push('Node 2: [inquiry] 라우팅 노드 진입');
        console.log('문의 답변 노드 진입');

        const inquiryPrompt = `
당신은 지식 가이드입니다. 고객의 문의 사항에 대해 정확하고 간결하게 한국어로 안내해 주세요.
문의사항: "${message}"
답변:`;
        const inquiryResponse = await model.invoke([new HumanMessage(inquiryPrompt)]);
        finalReply = extractText(inquiryResponse.content);
        executionLogs.push('문의 내용 안내 답변 작성 완료');
        break;

      default:
        executionLogs.push('Node 2: [general] 라우팅 노드 진입');
        console.log('일반 대화 노드 진입');

        const generalResponse = await model.invoke([
          new SystemMessage('당신은 일상적인 대화를 나누는 다정한 AI입니다.'),
          new HumanMessage(message)
        ]);
        finalReply = extractText(generalResponse.content);
        executionLogs.push('일반 단순 답변 작성 완료');
    }

    return res.json({
      reply: finalReply,
      logs: executionLogs,
      category,
      isSerious,
      dissatisfactionScore
    });
  } catch (error) {
    console.error('에이전트 가동 중 오류 발생:', error);
    return res.status(500).json({ error: error.message || '에이전트 실행 도중 오류가 발생했습니다.' });
  }
});

// 서버 구동
app.listen(PORT, function startServer() {
  console.log(`05_agent_patterns 서버가 포트 ${PORT} 에서 실행 중입니다.`);
});
