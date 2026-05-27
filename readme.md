# Shopping COSTCO

모바일 스타일 OCR 장보기 웹앱
장 볼때마다 일일이 계산기 두두리셨죠?
이젠 사진만 업로드하면 알아서 계산됩니다
수량을 추가나 삭제도 가능합니다

## 기능

- OCR 이미지 업로드
- IndexedDB 저장
- 상품 수량 조절
- 총합 계산
- 스와이프 삭제
- 탭 수정
- 길게누르기 상세편집
- 장보기 기록 저장
- PWA 지원
- 오프라인 동작

---

# 기술 스택

- HTML
- CSS
- JavaScript
- IndexedDB
- Tesseract.js
- PWA

---

# 모바일 앱처럼 설치하기

모바일 브라우저에서:

- iPhone:
  공유 → 홈 화면에 추가

- Android:
  메뉴 → 앱 설치

---

# OCR

현재:

- Tesseract.js 기반
- 로컬 OCR
- 서버 없음
- 무료

---

# 저장 구조

데이터는:

- IndexedDB
- 브라우저 내부

에 저장됩니다.

서버 업로드 없음.

---
