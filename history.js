const historyList =
document.getElementById("historyList");

window.onload = async ()=>{

  await initDB();

  const sessions =
    await getSessions();

  render(sessions.reverse());
};

function render(items){

  items.forEach(item=>{

    const card =
      document.createElement("div");

    card.className =
      "historyCard";

    card.innerHTML = `

      <h2>${item.title}</h2>

      <p>
        ${new Date(
          item.createdAt
        ).toLocaleString()}
      </p>

      <h1>
        ${item.total.toLocaleString()}원
      </h1>

      <p>
        상품 ${item.count}개
      </p>
    `;

    historyList.appendChild(card);
  });
}