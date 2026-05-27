const cameraInput = document.getElementById("cameraInput");
const galleryInput = document.getElementById("galleryInput");
const previewImage = document.getElementById("previewImage");
const productList = document.getElementById("productList");
const grandTotal = document.getElementById("grandTotal");
const itemCount = document.getElementById("itemCount");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");

let products = [];
let editingIndex = null;

window.onload = async () => {
  await initDB();
  products = await getProducts();
  renderProducts();
};

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  previewImage.src = url;
  previewImage.style.display = "block";
  runOCR(file, url);
}

cameraInput.addEventListener("change", handleImageSelect);
galleryInput.addEventListener("change", handleImageSelect);

async function runOCR(file, imageUrl) {
  // 로딩 표시
  productList.innerHTML = `<p style="text-align:center;padding:30px;color:#888;">📖 OCR 분석 중...<br>잠시 기다려주세요</p>`;

  try {
    const result = await Tesseract.recognize(file, "kor+eng", {
      logger: m => {
        if (m.status === "recognizing text") {
          const pct = Math.floor(m.progress * 100);
          productList.innerHTML = `<p style="text-align:center;padding:30px;color:#888;">📖 OCR 분석 중... ${pct}%</p>`;
        }
      }
    });

    const text = result.data.text;
    const parsed = parseOCRText(text, imageUrl);

    if (parsed.length === 0) {
      productList.innerHTML = `<p style="text-align:center;padding:30px;color:#f00;">인식된 상품이 없습니다.<br>다시 시도해주세요.</p>`;
      return;
    }

    for (const p of parsed) {
      await addProduct(p);
    }

    products = await getProducts();
    renderProducts();

  } catch (err) {
    productList.innerHTML = `<p style="text-align:center;padding:30px;color:#f00;">OCR 오류: ${err.message}</p>`;
  }
}

function parseOCRText(text, imageUrl) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 1);
  const results = [];

  // 가격 패턴: 숫자 4~7자리 (콤마 포함 가능)
  const priceRegex = /[\d,]{4,9}/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const priceMatch = line.match(priceRegex);

    if (priceMatch) {
      const price = parseInt(priceMatch[0].replace(/,/g, ""));
      if (price < 100 || price > 9999999) continue;

      // 가격이 있는 줄 또는 앞 줄을 상품명으로 사용
      const name = line.replace(priceMatch[0], "").trim() || lines[i - 1] || "상품";

      results.push({
        name: name.substring(0, 30),
        sub: "",
        price: price,
        qty: 1,
        image: imageUrl,
        selected: true,
        memo: ""
      });
    }
  }

  return results;
}

function renderProducts() {
  productList.innerHTML = "";
  let total = 0;
  let count = 0;

  products.forEach((p, index) => {
    if (p.selected) {
      total += p.price * p.qty;
      count += p.qty;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "swipeWrapper";
    wrapper.innerHTML = `
      <div class="deleteArea" onclick="removeItem(${p.id})">삭제</div>
      <div class="productCard">
        <input type="checkbox" ${p.selected ? "checked" : ""} onchange="toggleItem(${index})">
        <img src="${p.image}">
        <div class="productInfo">
          <h3 onclick="quickEdit(${index})">${p.name}</h3>
          <span>${p.sub}</span>
          <p>${p.price.toLocaleString()}원</p>
        </div>
        <div class="qtyBox">
          <button class="qtyBtn" onclick="changeQty(${index},-1)">-</button>
          <span>${p.qty}</span>
          <button class="qtyBtn" onclick="changeQty(${index},1)">+</button>
        </div>
      </div>
    `;
    productList.appendChild(wrapper);
    addSwipe(wrapper, index);
  });

  grandTotal.innerText = total.toLocaleString();
  itemCount.innerText = `${count}개`;
  updateSuggestions();
}

function addSwipe(wrapper, index) {
  const card = wrapper.querySelector(".productCard");
  let startX = 0;
  let currentX = 0;
  let pressTimer;

  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    pressTimer = setTimeout(() => {
      openEditSheet(index);
      navigator.vibrate && navigator.vibrate(10);
    }, 600);
  });

  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    if (diff < 0) {
      card.style.transform = `translateX(${Math.max(diff, -100)}px)`;
    }
  });

  card.addEventListener("touchend", () => {
    clearTimeout(pressTimer);
    const moved = currentX - startX;
    if (moved < -60) {
      card.style.transform = "translateX(-100px)";
    } else {
      card.style.transform = "translateX(0)";
    }
  });
}

async function changeQty(index, val) {
  products[index].qty += val;
  if (products[index].qty < 1) products[index].qty = 1;
  await updateProduct(products[index]);
  renderProducts();
}

async function toggleItem(index) {
  products[index].selected = !products[index].selected;
  await updateProduct(products[index]);
  renderProducts();
}

async function removeItem(id) {
  await deleteProduct(id);
  products = await getProducts();
  renderProducts();
}

function quickEdit(index) {
  const newName = prompt("상품명 수정", products[index].name);
  if (newName) {
    products[index].name = newName;
    updateProduct(products[index]);
    renderProducts();
  }
}

function openEditSheet(index) {
  editingIndex = index;
  const p = products[index];
  document.getElementById("sheetName").value = p.name;
  document.getElementById("sheetPrice").value = p.price;
  document.getElementById("sheetQty").value = p.qty;
  document.getElementById("sheetMemo").value = p.memo || "";
  document.getElementById("editSheet").classList.add("show");
}

document.getElementById("saveSheetBtn").addEventListener("click", async () => {
  const p = products[editingIndex];
  p.name = document.getElementById("sheetName").value;
  p.price = parseInt(document.getElementById("sheetPrice").value);
  p.qty = parseInt(document.getElementById("sheetQty").value);
  p.memo = document.getElementById("sheetMemo").value;
  await updateProduct(p);
  renderProducts();
  document.getElementById("editSheet").classList.remove("show");
});

resetBtn.addEventListener("click", async () => {
  if (confirm("전체 삭제할까요?")) {
    await clearProducts();
    products = [];
    renderProducts();
  }
});

saveBtn.addEventListener("click", async () => {
  const total = products.reduce((sum, p) => p.selected ? sum + p.price * p.qty : sum, 0);
  await addSession({ title: "장보기 기록", total, count: products.length, createdAt: Date.now() });
  alert("기록 저장 완료");
});

function goHistory() { location.href = "history.html"; }

function updateSuggestions() {
  const list = document.getElementById("productSuggestions");
  list.innerHTML = "";
  const names = [...new Set(products.map(p => p.name))];
  names.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    list.appendChild(option);
  });
}
