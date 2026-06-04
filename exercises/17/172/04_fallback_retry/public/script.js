// 1. DOM Cache (DOM 요소 캐싱)
const fallbackForm = document.querySelector('#fallback-form');
const promptInput = document.querySelector('#prompt-input');
const submitButton = document.querySelector('#submit-btn');
const logOutput = document.querySelector('#log-output');
const replyBox = document.querySelector('#reply-box');
const replyText = document.querySelector('#reply-text');

// 2. Event Listeners (이벤트 리스너 등록)
fallbackForm.addEventListener('submit', handleFormSubmit);

// 3. Event Handlers & Logics (핸들러 및 로직)

// 폼 전송 이벤트 핸들러
function handleFormSubmit(event) {
  event.preventDefault();

  const prompt = promptInput.value.trim();
  if (!prompt) {
    console.warn('전송할 입력값이 없습니다.');
    return;
  }

  console.log(`장애 자동 전환 테스트 호출. 질문: "${prompt}"`);

  // UI 로딩 설정
  toggleLoadingState(true);
  replyBox.style.display = 'none';

  // 로그 창 초기화 및 첫 번째 상태 기록
  logOutput.innerHTML = '';
  writeLog('서버로 테스트 시나리오 전송 시작...', 'normal');

  // 백엔드 요청
  sendFallbackRequest(prompt);
}

// 장애 자동 전환 요청 API
async function sendFallbackRequest(prompt) {
  try {
    const response = await axios.post('/api/fallback-chat', {
      message: prompt
    });

    console.log('서버로부터 장애 극복 데이터 수신 완료:', response.data);

    // 백엔드에서 생성해 보내준 실제 복구 처리 단계를 순차적으로 출력 (시각적인 연출 효과)
    await renderLogsSequentially(response.data.executionLogs);

    // 최종 답변 출력 (Marked와 DOMPurify를 활용한 마크다운 파싱 및 안전한 새니타이징 공통 표시)
    replyText.innerHTML = DOMPurify.sanitize(marked.parse(response.data.reply));
    replyBox.style.display = 'block';
  } catch (error) {
    console.error('호출 중 실패:', error);
    writeLog('최종 에러: 백업용 부 모델마저도 호출에 실패했습니다.', 'error');
  } finally {
    toggleLoadingState(false);
  }
}

// 터미널 스타일 로그 출력 함수 (insertAdjacentHTML 활용으로 DOM 객체 생성 비용 및 API 호출 최소화)
function writeLog(text, type = 'normal') {
  let logHtml = '';
  switch (true) {
    case (type === 'error'):
      logHtml = `<div class="log-entry error">❌ [ERROR] ${text}</div>`;
      break;
    case (type === 'success'):
      logHtml = `<div class="log-entry success">✅ [SUCCESS] ${text}</div>`;
      break;
    default:
      logHtml = `<div class="log-entry">ℹ️ [INFO] ${text}</div>`;
  }

  logOutput.insertAdjacentHTML('beforeend', logHtml);
  logOutput.scrollTop = logOutput.scrollHeight;
}

// 수신된 로그들을 시간 차를 두고 타임라인식으로 순차 렌더링하는 헬퍼 함수
async function renderLogsSequentially(logs) {
  for (let i = 0; i < logs.length; i++) {
    // 0.8초의 간격을 두어 시각적인 Failover 진행 상황 인지 도모
    await new Promise(function (resolve) {
      setTimeout(resolve, 800);
    });

    // 단순 이진 분기는 standard if-else 사용
    let logType = 'normal';
    if (logs[i].includes('실패') || logs[i].includes('에러')) {
      logType = 'error';
    } else if (logs[i].includes('완료') || logs[i].includes('성공')) {
      logType = 'success';
    }

    writeLog(logs[i], logType);
  }
}

// UI 헬퍼: 로딩 상태 관리
function toggleLoadingState(isLoading) {
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.textContent = '자동 장애 전환 테스트 구동 중...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = '호출 및 복구 테스트';
  }
}
