// 1. DOM Cache (DOM 요소 캐싱)
const chatForm = document.querySelector('#chat-form');
const userInput = document.querySelector('#user-input');
const chatOutput = document.querySelector('#chat-output');
const submitButton = document.querySelector('#submit-btn');
const providerSelect = document.querySelector('#provider-select');

// 2. Event Listeners (이벤트 리스너 등록)
chatForm.addEventListener('submit', handleFormSubmit);

// 3. Event Handlers & Logics (핸들러 및 로직)

// 폼 전송 이벤트 핸들러
function handleFormSubmit(event) {
  event.preventDefault();

  const message = userInput.value.trim();
  const provider = providerSelect.value;

  // 단순 폼 검증은 standard if 사용
  if (!message) {
    console.warn('입력값이 비어있어 전송을 중단합니다.');
    return;
  }

  console.log(`서버로 메시지 전송 시도. 제공자: ${provider}`);

  // UI 비활성화 및 사용자 메시지 출력
  toggleLoadingState(true);
  appendMessage('user', message);

  // 입력창 비우기
  clearInputField();

  // 동기 요청 실행
  sendInvokeRequest(provider, message);
}

// 동기 요청 (axios 활용)
async function sendInvokeRequest(provider, message) {
  try {
    const response = await axios.post('/api/chat', {
      provider: provider,
      message: message
    });

    console.log('서버로부터 응답 수신 완료:', response.data);
    appendMessage('agent', response.data.reply);
  } catch (error) {
    console.error('요청 중 오류 발생:', error);
    const errMsg = error.response?.data?.error || '서버 통신에 실패했습니다.';
    appendMessage('error', `오류: ${errMsg}`);
  } finally {
    toggleLoadingState(false);
  }
}

// UI 헬퍼: 메시지 요소 추가 (Marked와 DOMPurify를 활용한 마크다운 파싱 및 안전한 새니타이징 공통 표시)
function appendMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${sender}`;
  if (sender === 'agent') {
    messageElement.innerHTML = DOMPurify.sanitize(marked.parse(text));
  } else {
    messageElement.textContent = text;
  }
  chatOutput.appendChild(messageElement);
  chatOutput.scrollTop = chatOutput.scrollHeight;
  return messageElement;
}

// UI 헬퍼: 입력창 비우기
function clearInputField() {
  userInput.value = '';
  userInput.focus();
}

// UI 헬퍼: 로딩 상태 관리
function toggleLoadingState(isLoading) {
  // 단순 이진 분기는 standard if-else 사용
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.textContent = '처리 중...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = '전송';
  }
}
