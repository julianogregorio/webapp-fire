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

// Exibe todas as probabilidades na tela
function predictClass(prediction) {
    labelContainer.innerHTML = ""; // limpa resultados anteriores

    prediction.forEach(p => {
        const div = document.createElement("div");
        div.style.margin = "5px 0";
        div.innerHTML = `
            <strong>${p.className.toUpperCase()}</strong>: ${(p.probability * 100).toFixed(2)}%
        `;
        labelContainer.appendChild(div);
    });
}