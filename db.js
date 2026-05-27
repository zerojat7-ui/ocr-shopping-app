const DB_NAME = "OCRShopDB";
const DB_VERSION = 1;

let db;

function initDB(){

  return new Promise((resolve,reject)=>{

    const request =
      indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = ()=>reject();

    request.onsuccess = ()=>{

      db = request.result;

      resolve();
    };

    request.onupgradeneeded = e=>{

      db = e.target.result;

      if(!db.objectStoreNames.contains("products")){

        db.createObjectStore("products",{
          keyPath:"id",
          autoIncrement:true
        });
      }

      if(!db.objectStoreNames.contains("sessions")){

        db.createObjectStore("sessions",{
          keyPath:"id",
          autoIncrement:true
        });
      }
    };
  });
}

function getStore(name,mode){

  return db
    .transaction(name,mode)
    .objectStore(name);
}

async function addProduct(product){

  return new Promise(resolve=>{

    getStore("products","readwrite")
      .add(product)
      .onsuccess = ()=>resolve();
  });
}

async function getProducts(){

  return new Promise(resolve=>{

    getStore("products","readonly")
      .getAll()
      .onsuccess = e=>
        resolve(e.target.result);
  });
}

async function updateProduct(product){

  return new Promise(resolve=>{

    getStore("products","readwrite")
      .put(product)
      .onsuccess = ()=>resolve();
  });
}

async function deleteProduct(id){

  return new Promise(resolve=>{

    getStore("products","readwrite")
      .delete(id)
      .onsuccess = ()=>resolve();
  });
}

async function clearProducts(){

  return new Promise(resolve=>{

    getStore("products","readwrite")
      .clear()
      .onsuccess = ()=>resolve();
  });
}

async function addSession(data){

  return new Promise(resolve=>{

    getStore("sessions","readwrite")
      .add(data)
      .onsuccess = ()=>resolve();
  });
}

async function getSessions(){

  return new Promise(resolve=>{

    getStore("sessions","readonly")
      .getAll()
      .onsuccess = e=>
        resolve(e.target.result);
  });
}