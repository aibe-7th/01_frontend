// 1. DOM Cache (DOM 요소 캐싱)
const agentForm = document.querySelector('#agent-form');
const queryInput = document.querySelector('#query-input');
const submitButton = document.querySelector('#submit-btn');
const logOutput = document.querySelector('#log-output');
const resultBox = document.querySelector('#result-box');
const replyText = document.querySelector('#reply-text');

// 신규 대시보드 컴포넌트 캐싱
const dashboardBox = document.querySelector('#dashboard-box');
const categoryBadge = document.querySelector('#category-badge');
const severityBadge = document.querySelector('#severity-badge');
const dissatisfactionBar = document.querySelector('#dissatisfaction-bar');
const scoreText = document.querySelector('#score-text');

// 2. Event Listeners (이벤트 리스너 등록)
agentForm.addEventListener('submit', handleFormSubmit);

// 3. Event Handlers & Logics (핸들러 및 로직)

// 폼 전송 이벤트 핸들러
function handleFormSubmit(event) {
  event.preventDefault();

  const query = queryInput.value.trim();
  // 단순 폼 데이터 유효성 검증
  if (!query) {
    console.warn('입력 질문이 비어있습니다.');
    return;
  }

  console.log(`에이전트 처리 요청 시작. 입력내용: "${query}"`);

  // UI 로딩 상태 초기화
  toggleLoadingState(true);
  resultBox.classList.add('d-none');
  dashboardBox.classList.add('d-none');

  // 로그 보드 클리어
  logOutput.innerHTML = '';
  writeLog('에이전트 파이프라인 엔진 가동...', 'node');

  // 백엔드 요청
  sendAgentRequest(query);
}

// 에이전트 API 요청 함수
async function sendAgentRequest(query) {
  try {
    const response = await axios.post('/api/agent', {
      message: query
    });

    console.log('서버로부터 에이전트 실행 데이터 수신 완료:', response.data);

    // 로그 단계별 순차 렌더링
    await renderLogsSequentially(response.data.logs);

    // 대시보드 화면 매핑 및 노출
    renderDashboard(response.data);

    // 최종 답변 매핑 및 노출 (Marked와 DOMPurify를 활용한 마크다운 파싱 및 안전한 새니타이징 공통 표시)
    replyText.innerHTML = DOMPurify.sanitize(marked.parse(response.data.reply));
    resultBox.classList.remove('d-none');
  } catch (error) {
    console.error('에이전트 처리 도중 예외 에러:', error);
    writeLog('에이전트 엔진 구동 중 예기치 못한 하드웨어/API 오류가 발생했습니다.', 'warn');
  } finally {
    toggleLoadingState(false);
  }
}

// 대시보드 데이터 수치 매핑 함수 (단일 property 할당 방식을 통한 DOM 조작 및 리플로우 최소화)
function renderDashboard(data) {
  const category = data.category;
  const isSerious = data.isSerious;
  const dissatisfactionScore = data.dissatisfactionScore;

  // 1. 다중 분류 결과 매핑 (단일 className 할당으로 리플로우 최소화)
  let categoryText = '기타대화 (General)';
  let categoryClass = 'badge ms-2 p-2 bg-secondary';
  switch (true) {
    case (category === 'complaint'):
      categoryText = '고객불만 (Complaint)';
      categoryClass = 'badge ms-2 p-2 bg-danger';
      break;
    case (category === 'inquiry'):
      categoryText = '일반문의 (Inquiry)';
      categoryClass = 'badge ms-2 p-2 bg-success';
      break;
  }
  categoryBadge.textContent = categoryText;
  categoryBadge.className = categoryClass;

  // 2. 이진 분류 결과 매핑 (단일 className 할당)
  let severityText = '해당 없음';
  let severityClass = 'badge bg-secondary ms-2 p-2';
  if (category === 'complaint') {
    severityText = isSerious ? '심각 (Serious)' : '보통 (Normal)';
    severityClass = isSerious ? 'badge bg-danger ms-2 p-2' : 'badge bg-success ms-2 p-2';
  }
  severityBadge.textContent = severityText;
  severityBadge.className = severityClass;

  // 3. 수치 예측 결과 매핑 (불만족도 게이지 및 스코어 텍스트 업데이트 최소화)
  let barWidth = '0%';
  let barText = '0%';
  let barClass = 'progress-bar bg-secondary';
  let scoreLabel = '0 / 100';

  if (category === 'complaint') {
    barWidth = `${dissatisfactionScore}%`;
    barText = `${dissatisfactionScore}%`;
    scoreLabel = `${dissatisfactionScore} / 100`;

    switch (true) {
      case (dissatisfactionScore >= 70):
        barClass = 'progress-bar bg-danger';
        break;
      case (dissatisfactionScore >= 40):
        barClass = 'progress-bar bg-warning text-dark';
        break;
      default:
        barClass = 'progress-bar bg-success';
    }
  }

  dissatisfactionBar.style.width = barWidth;
  dissatisfactionBar.textContent = barText;
  dissatisfactionBar.className = barClass;
  scoreText.textContent = scoreLabel;

  // 대시보드 컴포넌트 노출
  dashboardBox.classList.remove('d-none');
}

// 터미널 스타일 로그 렌더링 헬퍼 (insertAdjacentHTML을 활용해 DOM API 호출 최소화)
function writeLog(text, type = 'normal') {
  let logHtml = '';
  switch (true) {
    case (type === 'node'):
      logHtml = `<div class="log-item text-warning fw-bold">⚙️ [SYSTEM NODE] ${text}</div>`;
      break;
    case (type === 'success'):
      logHtml = `<div class="log-item text-success">✔ [SUCCESS] ${text}</div>`;
      break;
    case (type === 'warn'):
      logHtml = `<div class="log-item text-danger">⚠ [WARNING] ${text}</div>`;
      break;
    default:
      logHtml = `<div class="log-item">➔ [LOG] ${text}</div>`;
  }

  logOutput.insertAdjacentHTML('beforeend', logHtml);
  logOutput.scrollTop = logOutput.scrollHeight;
}

// 로그 배열을 일정 딜레이를 주며 화면에 그리는 순차 렌더링 함수
async function renderLogsSequentially(logs) {
  for (let i = 0; i < logs.length; i++) {
    // 로그 흐름 딜레이 0.6초
    await new Promise(function (resolve) {
      setTimeout(resolve, 600);
    });

    const currentLog = logs[i];
    let logType = 'normal';

    // 3개 이상 다중 문자열 매칭 분기는 switch true 사용
    switch (true) {
      case (currentLog.includes('Node') || currentLog.includes('시작') || currentLog.includes('라우팅')):
        logType = 'node';
        break;
      case (currentLog.includes('통과') || currentLog.includes('성공') || currentLog.includes('완료') || currentLog.includes('PASS')):
        logType = 'success';
        break;
      case (currentLog.includes('실패') || currentLog.includes('FAIL') || currentLog.includes('에러')):
        logType = 'warn';
        break;
    }

    writeLog(currentLog, logType);
  }
}

// UI 헬퍼: 로딩 상태 관리
function toggleLoadingState(isLoading) {
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.textContent = '에이전트 인프라 실행 중...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = '에이전트 가동';
  }
}
