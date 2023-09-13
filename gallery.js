setTimeout(() => {
    if(db){
        // video retrieval
        let videoDBTransaction = db.transaction("video", "readonly");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let galleryContainer = document.querySelector('.gallery-container');
            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) => {
                let mediaElement = document.createElement('div');
                mediaElement.setAttribute('class', 'media-container');
                mediaElement.setAttribute('id', videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);
                mediaElement.innerHTML = `
                    <div class="media">
                        <video autoplay loop src="${url}"></video>
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `

                let deleteBtn = mediaElement.querySelector(".delete");
                deleteBtn.addEventListener('click', deleteListener);

                let downloadBtn = mediaElement.querySelector('.download');
                downloadBtn.addEventListener('click', downloadListener);

                galleryContainer.append(mediaElement);
            })
        }

        //image retrieval
        let imageDBTransaction = db.transaction("image", "readonly")
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let galleryContainer = document.querySelector('.gallery-container');
            let imageResult = imageRequest.result;
            imageResult.forEach((imageObj) => {
                let mediaElement = document.createElement('div');
                mediaElement.setAttribute('class', 'media-container');
                mediaElement.setAttribute('id', imageObj.id);

                mediaElement.innerHTML = `
                    <div class="media">
                        <img alt="image" src="${imageObj.url}"></img>
                    </div>
                    <div class="delete action-btn">DELETE</div>
                    <div class="download action-btn">DOWNLOAD</div>
                `

                let deleteBtn = mediaElement.querySelector(".delete");
                deleteBtn.addEventListener('click', deleteListener);

                let downloadBtn = mediaElement.querySelector('.download');
                downloadBtn.addEventListener('click', downloadListener);

                galleryContainer.append(mediaElement);
            })
        }
    }
}, 100);


function deleteListener(e){
    // DB removal
    let id = e.target.parentElement.getAttribute('id');
    let type = id.slice(0, 3);
    if(type === 'vid'){
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if(type === 'img'){
        let imageDBTransaction = db.transaction("image", "readwrite")
        let imageStore = imageDBTransaction.objectStore("image");
        imageStore.delete(id)
    }

    //UI removal
    e.target.parentElement.remove();
}
function downloadListener(e){
    let id = e.target.parentElement.getAttribute('id');
    let type = id.slice(0, 3);
    if(type === 'vid'){
        let videoDBTransaction = db.transaction("video", "readwrite");
        let videoStore = videoDBTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement('a');
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click()
        }
    }
    else if(type === 'img'){
        let imageDBTransaction = db.transaction("image", "readwrite")
        let imageStore = imageDBTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let imageURL = imageResult.url;
            let a = document.createElement('a');
            a.href = imageURL;
            a.download = "image.jpg";
            a.click()
        }
    }
}
