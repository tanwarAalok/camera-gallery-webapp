let db;

let openRequest = indexedDB.open("gallery_DB");
openRequest.addEventListener('success', (e) => {
    console.log("db success");
    db = openRequest.result;
})
openRequest.addEventListener('error', (e) => {
    console.log("db error")
})
openRequest.addEventListener('upgradeneeded', (e) => {
    console.log("db upgrade");
    db = openRequest.result;

    db.createObjectStore("video", { keyPath: "id"});
    db.createObjectStore("image", { keyPath: "id"});
})
