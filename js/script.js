
const URL = "./my_model/";

let model, labelContainer, maxPredictions;


async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}


async function predictFromFile() {
    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('file-preview-container');
    
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            previewContainer.innerHTML = `
                <img id="target-image" src="${e.target.result}" width="200" style="border-radius: 8px;">
            `;
            const imgElement = document.getElementById('target-image');
            imgElement.onload = async () => {
                await runStaticPrediction(imgElement);
            };
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
}


async function runStaticPrediction(imgElement) {
    if (model == null) {
        await loadModel();
    }

    console.log("Dimensões da imagem:", imgElement.width, imgElement.height);

    
    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(imgElement, 0, 0, 224, 224);

    
    const prediction = await model.predict(canvas);
    console.log("Predição com canvas:", prediction);

    
    predictClass(prediction);
}


function predictClass(prediction) {
    labelContainer.innerHTML = ""; // limpa resultados anteriores

    console.log("Valores brutos:", prediction);

    prediction.forEach(p => {
        const div = document.createElement("div");
        div.style.margin = "5px 0";
        div.innerHTML = `
            <strong>${p.className.toUpperCase()}</strong>: ${(p.probability * 100).toFixed(2)}%
        `;
        labelContainer.appendChild(div);
    });
}