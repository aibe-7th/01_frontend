// ==========================================
// 0. 초기 설정 및 BOM 연동
// ==========================================

// localStorage에서 저장된 API URL 로드
let BASE_URL = localStorage.getItem('mockapi_url');

if (!BASE_URL) {
  BASE_URL = prompt('사용할 MockAPI Endpoint URL을 입력하세요:\n(예: https://xxxxxxxxxxxxxxxxxxxxxxxx.mockapi.io/users)');
  if (BASE_URL) {
    BASE_URL = BASE_URL.trim();
    localStorage.setItem('mockapi_url', BASE_URL);
  } else {
    alert('API URL이 설정되지 않아 정상적으로 작동하지 않습니다. 새로고침 후 다시 입력해 주세요.');
  }
}

// 사용할 통신 방식 선택: 'fetch' 또는 'axios'
const HTTP_CLIENT = 'fetch'; 


// ==========================================
// 1. Fetch API 구현
// ==========================================

async function fetchGetUsers() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`GET 실패! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch GetUsers 에러:', error);
    alert('목록 로드 중 에러가 발생했습니다.');
  }
}

async function fetchCreateUser(name, email) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) {
      throw new Error(`POST 실패! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch CreateUser 에러:', error);
  }
}

async function fetchUpdateUser(id, name, email) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) {
      throw new Error(`PUT 실패! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch UpdateUser 에러:', error);
  }
}

async function fetchDeleteUser(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`DELETE 실패! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch DeleteUser 에러:', error);
  }
}


// ==========================================
// 2. Axios 구현 (Fetch와 비교 분석용)
// ==========================================

async function axiosGetUsers() {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Axios GetUsers 에러:', error.message);
    alert('목록 로드 중 에러가 발생했습니다.');
  }
}

async function axiosCreateUser(name, email) {
  try {
    const response = await axios.post(BASE_URL, { name, email });
    return response.data;
  } catch (error) {
    console.error('Axios CreateUser 에러:', error.message);
  }
}

async function axiosUpdateUser(id, name, email) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, { name, email });
    return response.data;
  } catch (error) {
    console.error('Axios UpdateUser 에러:', error.message);
  }
}

async function axiosDeleteUser(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Axios DeleteUser 에러:', error.message);
  }
}


// ==========================================
// 3. DOM 생성 및 UI 유틸리티
// ==========================================

function clearContainer(element) {
  element.innerHTML = '';
}

function showMessageNode(container, message) {
  clearContainer(container);
  const li = document.createElement('li');
  li.textContent = message;
  container.appendChild(li);
}

/**
 * 단일 사용자 HTML 엘리먼트 생성 및 조립 (초심자 직관용 정석 코드)
 */
function createUserNode(user) {
  // 1. 바깥 테두리 li 생성
  const li = document.createElement('li');
  li.className = 'user-item';

  // 2. 유저 정보 영역 div 생성
  const infoDiv = document.createElement('div');
  infoDiv.className = 'user-info';

  const nameSpan = document.createElement('span');
  nameSpan.className = 'user-name';
  nameSpan.textContent = user.name;

  const emailSpan = document.createElement('span');
  emailSpan.className = 'user-email';
  emailSpan.textContent = user.email;

  // 정보 div에 붙이기
  infoDiv.appendChild(nameSpan);
  infoDiv.appendChild(emailSpan);

  // 3. 버튼 영역 div 생성
  const actionDiv = document.createElement('div');
  actionDiv.className = 'action-buttons';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = '수정';
  editBtn.setAttribute('data-id', user.id);
  editBtn.setAttribute('data-name', user.name);
  editBtn.setAttribute('data-email', user.email);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '삭제';
  deleteBtn.setAttribute('data-id', user.id);

  // 버튼 div에 붙이기
  actionDiv.appendChild(editBtn);
  actionDiv.appendChild(deleteBtn);

  // 4. 최종 li에 정보 div와 버튼 div를 부착
  li.appendChild(infoDiv);
  li.appendChild(actionDiv);
  
  return li;
}


// ==========================================
// 4. 비즈니스 렌더링 통합 및 UI 기능 쪼개기
// ==========================================

async function loadAndRenderUsers(container) {
  if (!BASE_URL) return;

  showMessageNode(container, '로딩 중...');
  
  // HTTP_CLIENT 설정에 따라 적절한 API 함수 명시적으로 호출
  let users;
  if (HTTP_CLIENT === 'fetch') {
    users = await fetchGetUsers();
  } else {
    users = await axiosGetUsers();
  }
  
  clearContainer(container);
  
  if (!users || users.length === 0) {
    showMessageNode(container, '사용자가 없습니다.');
    return;
  }

  // 화면에 목록 렌더링
  users.forEach(user => {
    const userNode = createUserNode(user);
    container.appendChild(userNode);
  });
}

// --- 입력 필드 초기화 헬퍼 함수 ---
function resetFormInputs(usernameInput, useremailInput) {
  usernameInput.value = '';
  useremailInput.value = '';
}

// --- 수정 폼으로 UI 전환 ---
function showEditForm(editArea, userForm, inputs, user) {
  inputs.editId.value = user.id;
  inputs.editName.value = user.name;
  inputs.editEmail.value = user.email;

  editArea.classList.remove('hidden');
  userForm.classList.add('hidden');
}

// --- 추가 폼으로 UI 전환 (수정 종료/취소) ---
function showCreateForm(editArea, userForm) {
  editArea.classList.add('hidden');
  userForm.classList.remove('hidden');
}


// ==========================================
// 5. 메인 컨트롤러 및 이벤트 리스너 바인딩
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.querySelector('#user-form');
  const usernameInput = document.querySelector('#username');
  const useremailInput = document.querySelector('#useremail');
  
  const editArea = document.querySelector('#edit-area');
  const editIdInput = document.querySelector('#edit-id');
  const editUsernameInput = document.querySelector('#edit-username');
  const editUseremailInput = document.querySelector('#edit-useremail');
  
  const loadBtn = document.querySelector('#load-btn');
  const updateBtn = document.querySelector('#update-btn');
  const cancelBtn = document.querySelector('#cancel-btn');
  const userList = document.querySelector('#user-list');

  // 호출 편의를 위한 폼 인풋 전달 객체
  const editInputs = {
    editId: editIdInput,
    editName: editUsernameInput,
    editEmail: editUseremailInput
  };

  // --- 이벤트 리스너 설정 ---

  // 목록 새로고침 클릭
  loadBtn.addEventListener('click', () => {
    loadAndRenderUsers(userList);
  });

  // 사용자 추가 제출
  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = usernameInput.value.trim();
    const email = useremailInput.value.trim();
    if (!name || !email) return;

    let result;
    if (HTTP_CLIENT === 'fetch') {
      result = await fetchCreateUser(name, email);
    } else {
      result = await axiosCreateUser(name, email);
    }

    if (result) {
      resetFormInputs(usernameInput, useremailInput);
      await loadAndRenderUsers(userList);
    }
  });

  // 목록 내 버튼 클릭 (이벤트 위임)
  userList.addEventListener('click', async (e) => {
    const target = e.target;

    // 삭제 버튼 클릭 시
    if (target.classList.contains('delete-btn')) {
      const id = target.getAttribute('data-id');
      if (confirm('삭제하시겠습니까?')) {
        let deleted;
        if (HTTP_CLIENT === 'fetch') {
          deleted = await fetchDeleteUser(id);
        } else {
          deleted = await axiosDeleteUser(id);
        }

        if (deleted) {
          await loadAndRenderUsers(userList);
        }
      }
    }

    // 수정 버튼 클릭 시
    if (target.classList.contains('edit-btn')) {
      const id = target.getAttribute('data-id');
      const name = target.getAttribute('data-name');
      const email = target.getAttribute('data-email');
      
      showEditForm(editArea, userForm, editInputs, { id, name, email });
    }
  });

  // 수정 완료 클릭
  updateBtn.addEventListener('click', async () => {
    const id = editIdInput.value;
    const name = editUsernameInput.value.trim();
    const email = editUseremailInput.value.trim();
    if (!name || !email) return;

    let updated;
    if (HTTP_CLIENT === 'fetch') {
      updated = await fetchUpdateUser(id, name, email);
    } else {
      updated = await axiosUpdateUser(id, name, email);
    }

    if (updated) {
      showCreateForm(editArea, userForm);
      await loadAndRenderUsers(userList);
    }
  });

  // 수정 취소 클릭
  cancelBtn.addEventListener('click', () => {
    showCreateForm(editArea, userForm);
  });

  // 페이지 진입 시 최초 1회 자동 로드
  loadAndRenderUsers(userList);
});
