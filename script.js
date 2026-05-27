const imageInput =
document.getElementById("imageInput");

const previewImage =
document.getElementById("previewImage");

const productList =
document.getElementById("productList");

const grandTotal =
document.getElementById("grandTotal");

const itemCount =
document.getElementById("itemCount");

const resetBtn =
document.getElementById("resetBtn");

const saveBtn =
document.getElementById("saveBtn");

let products = [];
let editingIndex = null;

window.onload = async ()=>{

  await initDB();

  products = await getProducts();

  renderProducts();
};

imageInput.addEventListener("change",
async e=>{

  const file = e.target.files[0];

  if(!file) return;

  previewImage.src =
    URL.createObjectURL(file);

  fakeOCR();
});

async function fakeOCR(){

  await addProduct({

    name:"KIRKLAND SIGNATURE",

    sub:"올리브유 1L",

    price:22990,

    qty:1,

    image:previewImage.src,

    selected:true,

    memo:""
  });

  products = await getProducts();

  renderProducts();
}

function renderProducts(){

  productList.innerHTML = "";

  let total = 0;
  let count = 0;

  products.forEach((p,index)=>{

    if(p.selected){

      total += p.price * p.qty;

      count += p.qty;
    }

    const wrapper =
      document.createElement("div");

    wrapper.className =
      "swipeWrapper";

    wrapper.innerHTML = `

      <div class="deleteArea"
           onclick="removeItem(${p.id})">
        삭제
      </div>

      <div class="productCard">

        <input type="checkbox"
               ${p.selected ? "checked" : ""}
               onchange="toggleItem(${index})">

        <img src="${p.image}">

        <div class="productInfo">

          <h3 onclick="quickEdit(${index})">
            ${p.name}
          </h3>

          <span>${p.sub}</span>

          <p>
            ${p.price.toLocaleString()}원
          </p>

        </div>

        <div class="qtyBox">

          <button class="qtyBtn"
                  onclick="changeQty(${index},-1)">
            -
          </button>

          <span>${p.qty}</span>

          <button class="qtyBtn"
                  onclick="changeQty(${index},1)">
            +
          </button>

        </div>

      </div>
    `;

    productList.appendChild(wrapper);

    addSwipe(wrapper,index);
  });

  grandTotal.innerText =
    total.toLocaleString();

  itemCount.innerText =
    `${count}개`;

  updateSuggestions();
}

function addSwipe(wrapper,index){

  const card =
    wrapper.querySelector(".productCard");

  let startX = 0;
  let currentX = 0;
  let pressTimer;

  card.addEventListener("touchstart",e=>{

    startX = e.touches[0].clientX;

    pressTimer = setTimeout(()=>{

      openEditSheet(index);

      navigator.vibrate(10);

    },600);
  });

  card.addEventListener("touchmove",e=>{

    currentX = e.touches[0].clientX;

    const diff = currentX - startX;

    if(diff < 0){

      card.style.transform =
        `translateX(${Math.max(diff,-100)}px)`;
    }
  });

  card.addEventListener("touchend",()=>{

    clearTimeout(pressTimer);

    const moved = currentX - startX;

    if(moved < -60){

      card.style.transform =
        "translateX(-100px)";
    }
    else{

      card.style.transform =
        "translateX(0)";
    }
  });
}

async function changeQty(index,val){

  products[index].qty += val;

  if(products[index].qty < 1){
    products[index].qty = 1;
  }

  await updateProduct(products[index]);

  renderProducts();
}

async function toggleItem(index){

  products[index].selected =
    !products[index].selected;

  await updateProduct(products[index]);

  renderProducts();
}

async function removeItem(id){

  await deleteProduct(id);

  products = await getProducts();

  renderProducts();
}

function quickEdit(index){

  const newName =
    prompt(
      "상품명 수정",
      products[index].name
    );

  if(newName){

    products[index].name =
      newName;

    updateProduct(products[index]);

    renderProducts();
  }
}

function openEditSheet(index){

  editingIndex = index;

  const p = products[index];

  document
    .getElementById("sheetName")
    .value = p.name;

  document
    .getElementById("sheetPrice")
    .value = p.price;

  document
    .getElementById("sheetQty")
    .value = p.qty;

  document
    .getElementById("sheetMemo")
    .value = p.memo || "";

  document
    .getElementById("editSheet")
    .classList.add("show");
}

document
.getElementById("saveSheetBtn")
.addEventListener("click",
async ()=>{

  const p =
    products[editingIndex];

  p.name =
    document
      .getElementById("sheetName")
      .value;

  p.price =
    parseInt(
      document
        .getElementById("sheetPrice")
        .value
    );

  p.qty =
    parseInt(
      document
        .getElementById("sheetQty")
        .value
    );

  p.memo =
    document
      .getElementById("sheetMemo")
      .value;

  await updateProduct(p);

  renderProducts();

  document
    .getElementById("editSheet")
    .classList.remove("show");
});

resetBtn.addEventListener("click",
async ()=>{

  if(confirm("전체 삭제할까요?")){

    await clearProducts();

    products = [];

    renderProducts();
  }
});

saveBtn.addEventListener("click",
async ()=>{

  const total =
    products.reduce((sum,p)=>{

      if(p.selected){

        return sum +
          p.price * p.qty;
      }

      return sum;

    },0);

  await addSession({

    title:"장보기 기록",

    total,

    count:products.length,

    createdAt:Date.now()
  });

  alert("기록 저장 완료");
});

function goHistory(){

  location.href =
    "history.html";
}

function updateSuggestions(){

  const list =
    document.getElementById(
      "productSuggestions"
    );

  list.innerHTML = "";

  const names =
    [...new Set(
      products.map(p=>p.name)
    )];

  names.forEach(name=>{

    const option =
      document.createElement("option");

    option.value = name;

    list.appendChild(option);
  });
}