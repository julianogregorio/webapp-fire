// Link para o modelo exportado pelo Teachable Machine
const URL = "./my_model/";

let model, labelContainer, maxPredictions;

// Carregar o modelo
async function loadModel() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
}

// Função para ler o arquivo enviado pelo usuário
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

// Executa a predição em uma imagem estática
async function runStaticPrediction(imgElement) {
    if (model == null) {
        await loadModel();
    }
    const prediction = await model.predict(imgElement);
    predictClass(prediction);
}

// Exibe o resultado da predição
function predictClass(prediction) {
    let highestProb = 0;
    let bestClass = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestClass = prediction[i].className;
        }
    }

    let statusColor = "#2ecc71"; 
    if (bestClass.toLowerCase().includes("no") || bestClass.toLowerCase().includes("sem")) {
        statusColor = "#e74c3c";
    }

    labelContainer.innerHTML = `
        <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; border-left: 5px solid ${statusColor}">
            <strong>RESULTADO DO ARQUIVO:</strong>
            <h2 style="color: ${statusColor}; margin: 5px 0;">${bestClass.toUpperCase()}</h2>
            <small>Confiança: ${(highestProb * 100).toFixed(2)}%</small>
        </div>`;
}