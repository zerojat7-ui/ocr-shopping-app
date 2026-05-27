# 🛒 Shopping COSTCO

모바일 스타일 OCR 장보기 웹앱  
장 볼때마다 일일이 계산기 두드리셨죠?  
이젠 사진만 업로드하면 알아서 계산됩니다  
수량 추가나 삭제도 가능합니다

---

## 기능

- 📷 카메라 촬영 또는 갤러리 업로드
- 🔍 Tesseract.js OCR 자동 인식 (한국어 + 영어)
- 💾 IndexedDB 로컬 저장
- ➕ 상품 수량 조절
- 🧮 총합 자동 계산
- 👆 탭으로 상품명 빠른 수정
- 👋 스와이프로 상품 삭제
- ✏️ 길게 누르기로 상세 편집 (이름 / 가격 / 수량 / 메모)
- 🧾 장보기 기록 저장 및 히스토리 조회
- 📱 PWA 지원 (홈 화면 설치 가능)
- 🌐 오프라인 동작 (Service Worker 캐시)

---

## 기술 스택

- HTML / CSS / JavaScript
- IndexedDB (로컬 데이터 저장)
- Tesseract.js (로컬 OCR)
- PWA (Service Worker + manifest.json)

---

## 모바일 앱처럼 설치하기

모바일 브라우저에서:

- **iPhone:** 공유 → 홈 화면에 추가
- **Android:** 메뉴 → 앱 설치

---

## OCR 안내

- Tesseract.js 기반 로컬 OCR
- 한국어 + 영어 동시 인식
- 서버 없음 / 무료
- 처음 실행 시 언어 데이터 로딩으로 10~30초 소요될 수 있음
- 영수증이 선명할수록 인식률 향상
- 인식 오류 시 탭 또는 길게 누르기로 수동 수정 가능

---

## 저장 구조

- IndexedDB (브라우저 내부 저장)
- 서버 업로드 없음
- 개인정보 외부 전송 없음

---

## 파일 구조

```
├── index.html       # 메인 쇼핑 화면
├── history.html     # 기록 조회 화면
├── style.css        # 스타일
├── script.js        # 메인 로직 + OCR
├── history.js       # 기록 화면 로직
├── db.js            # IndexedDB 헬퍼
├── sw.js            # Service Worker
└── manifest.json    # PWA 설정
```
