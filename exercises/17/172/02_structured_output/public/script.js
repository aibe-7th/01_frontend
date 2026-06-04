// 1. DOM Cache (DOM 요소 캐싱)
const analyzeForm = document.querySelector('#analyze-form');
const reviewInput = document.querySelector('#review-input');
const providerSelect = document.querySelector('#provider-select');
const submitButton = document.querySelector('#submit-btn');
const resultBox = document.querySelector('#result-box');
const sentimentBadge = document.querySelector('#sentiment-badge');
const urgentBadge = document.querySelector('#urgent-badge');
const summaryText = document.querySelector('#summary-text');
const keywordsBox = document.querySelector('#keywords-box');

// 2. Event Listeners (이벤트 리스너 등록)
analyzeForm.addEventListener('submit', handleFormSubmit);

// 3. Event Handlers & Logics (핸들러 및 로직)

// 폼 전송 이벤트 핸들러
function handleFormSubmit(event) {
  event.preventDefault();

  const reviewText = reviewInput.value.trim();
  const provider = providerSelect.value;

  if (!reviewText) {
    console.warn('분석할 리뷰 텍스트가 비어있습니다.');
    return;
  }

  console.log(`리뷰 분석을 서버에 요청합니다. 제공자: ${provider}, 분석할 텍스트: "${reviewText}"`);

  // UI 비활성화
  toggleLoadingState(true);

  // API 호출 실행
  sendAnalysisRequest(reviewText, provider);
}

// 리뷰 분석 API 비동기 요청 함수
async function sendAnalysisRequest(reviewText, provider) {
  try {
    const response = await axios.post('/api/analyze', {
      review: reviewText,
      provider: provider
    });

    console.log('서버로부터 분석 응답을 성공적으로 수신했습니다:', response.data);
    
    // 결과 화면 업데이트 및 표시
    renderResults(response.data);
  } catch (error) {
    console.error('분석 처리 요청 실패:', error);
    alert('리뷰 분석 진행 중 오류가 발생했습니다.');
  } finally {
    toggleLoadingState(false);
  }
}

// UI 헬퍼: 분석 결과를 HTML 컴포넌트에 매핑 및 렌더링 (DOM 조작 및 리플로우 최소화)
function renderResults(data) {
  // 1. 감정 분석 결과 스타일 바인딩 (단일 className 할당으로 스타일 갱신 비용 최적화)
  const sentiment = data.sentiment;
  sentimentBadge.textContent = getSentimentKorean(sentiment);
  
  let sentimentClass = 'badge fs-6 p-2';
  switch (true) {
    case (sentiment === 'positive'):
      sentimentClass += ' bg-success';
      break;
    case (sentiment === 'negative'):
      sentimentClass += ' bg-danger';
      break;
    default:
      sentimentClass += ' bg-warning text-dark';
  }
  sentimentBadge.className = sentimentClass;

  // 2. 긴급 상태 결과 스타일 바인딩 (단일 className 할당)
  const isUrgent = data.isUrgent;
  urgentBadge.textContent = isUrgent ? '긴급 (빠른 대응 요망)' : '일반';
  urgentBadge.className = isUrgent ? 'badge fs-6 p-2 bg-danger' : 'badge fs-6 p-2 bg-secondary';

  // 3. 한 문장 요약 및 키워드 출력 (Marked와 DOMPurify를 활용한 마크다운 파싱 및 안전한 새니타이징 공통 표시)
  summaryText.innerHTML = DOMPurify.sanitize(marked.parse(data.summary));
  
  // 4. 키워드 배지 리스트 구성 (DocumentFragment를 활용하여 1회의 DOM 추가로 단축)
  keywordsBox.innerHTML = '';
  if (Array.isArray(data.keywords)) {
    const fragment = document.createDocumentFragment();
    data.keywords.forEach(function (word) {
      const badge = document.createElement('span');
      badge.className = 'badge bg-primary keyword-badge me-1 fs-6';
      badge.textContent = word;
      fragment.appendChild(badge);
    });
    keywordsBox.appendChild(fragment);
  } else {
    keywordsBox.textContent = '추출된 키워드가 없습니다.';
  }

  // 결과 영역 표시
  resultBox.style.display = 'block';
}

// 감정 상태에 맞는 한국어 텍스트 변환 헬퍼
function getSentimentKorean(sentiment) {
  switch (sentiment) {
    case 'positive': return '긍정';
    case 'negative': return '부정';
    case 'neutral': return '중립';
    default: return sentiment;
  }
}

// UI 헬퍼: 로딩 상태 관리
function toggleLoadingState(isLoading) {
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.textContent = '리뷰 요약 및 감정 분석 진행 중...';
  } else {
    submitButton.disabled = false;
    submitButton.textContent = '리뷰 분석 시작';
  }
}
