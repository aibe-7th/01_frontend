// 1. DOM Cache (DOM 요소 캐싱)
const chatForm = document.querySelector('#chat-form');
const userInput = document.querySelector('#user-input');
const chatOutput = document.querySelector('#chat-output');
const submitButton = document.querySelector('#submit-btn');
const clearButton = document.querySelector('#clear-btn');
const providerSelect = document.querySelector('#provider-select');
const systemMessageInput = document.querySelector('#system-message-input');

// 대화 내역 저장을 위한 메모리 변수
let chatHistory = [];

// 2. Event Listeners (이벤트 리스너 등록)
chatForm.addEventListener('submit', handleFormSubmit);
clearButton.addEventListener('click', handleClearHistory);
window.addEventListener('DOMContentLoaded', initializeChat);

// 3. Event Handlers & Logics (핸들러 및 로직)

// 초기 대화 화면 설정 및 기존 이력 로드
function initializeChat() {
  console.log('대화 이력을 localStorage에서 로드합니다.');
  
  try {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      chatHistory = JSON.parse(savedHistory);
      console.log(`로드된 이전 메시지 개수: ${chatHistory.length}`);
    }
  } catch (error) {
    console.error('localStorage 대화 내역 분석 오류:', error);
    chatHistory = [];
  }

  // 화면 리셋 및 렌더링
  renderHistory();
}

// 폼 전송 이벤트 핸들러
function handleFormSubmit(event) {
  event.preventDefault();

  const message = userInput.value.trim();
  if (!message) {
    console.warn('전송할 입력값이 없습니다.');
    return;
  }

  console.log(`새로운 질문 전송: "${message}"`);

  // 대화 내역 배열에 사용자 메시지 추가 및 저장
  chatHistory.push({ role: 'user', content: message });
  saveHistoryToStorage();

  // 화면에 사용자 메시지 렌더링
  appendMessage('user', message);

  // 입력 필드 비우기
  clearInputField();

  // 버튼 로딩 상태 활성화
  toggleLoadingState(true);

  // 서버에 대화 내역 전체를 전달하여 호출
  sendChatHistory();
}

// 대화 초기화 이벤트 핸들러
function handleClearHistory() {
  if (confirm('모든 대화 내역을 초기화하시겠습니까?')) {
    console.log('대화 내역 초기화를 요청받았습니다.');
    chatHistory = [];
    localStorage.removeItem('chatHistory');
    renderHistory();
  }
}

// 서버에 전체 대화 내역을 전송하는 함수
async function sendChatHistory() {
  try {
    const response = await axios.post('/api/chat', {
      messages: chatHistory,
      provider: providerSelect.value,
      systemMessage: systemMessageInput.value.trim() || undefined
    });

    console.log('서버로부터 답변 수신 완료:', response.data);
    const reply = response.data.reply;

    // 대화 내역 배열에 어시스턴트 메시지 추가 및 저장
    chatHistory.push({ role: 'assistant', content: reply });
    saveHistoryToStorage();

    // 화면에 답변 메시지 출력
    appendMessage('agent', reply);
  } catch (error) {
    console.error('대화 통신 중 오류 발생:', error);
    // 오류 발생 시 임시 경고 출력 및 에러 메시지 렌더링
    appendMessage('error', '대화 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    // 대화 컨텍스트가 깨지지 않도록 마지막 질문 삭제
    chatHistory.pop();
    saveHistoryToStorage();
  } finally {
    toggleLoadingState(false);
  }
}

// UI 헬퍼: 현재 대화 이력 화면 렌더링 (DocumentFragment 활용으로 돔 리플로우 최소화)
function renderHistory() {
  chatOutput.innerHTML = '';

  if (chatHistory.length === 0) {
    // 대화 이력이 비어 있을 때 기본 웰컴 메시지 설정
    appendMessage('agent', '안녕하세요! 이전 대화 내용을 기억하는 AI 도반입니다. 무엇을 도와드릴까요?');
  } else {
    const fragment = document.createDocumentFragment();
    chatHistory.forEach(function (msg) {
      const messageElement = document.createElement('div');
      // assistant 역할은 agent 클래스로 변경하여 렌더링
      const className = msg.role === 'assistant' ? 'agent' : msg.role;
      messageElement.className = `message ${className}`;
      if (className === 'agent') {
        messageElement.innerHTML = DOMPurify.sanitize(marked.parse(msg.content));
      } else {
        messageElement.textContent = msg.content;
      }
      fragment.appendChild(messageElement);
    });
    chatOutput.appendChild(fragment);
    chatOutput.scrollTop = chatOutput.scrollHeight;
  }
}

// UI 헬퍼: localStorage 저장
function saveHistoryToStorage() {
  localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// UI 헬퍼: 메시지 요소 추가 (단일 메시지 입력 시 사용, Marked & DOMPurify 공통 적용)
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
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.textContent = '답변 작성 중...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = '전송';
  }
}
