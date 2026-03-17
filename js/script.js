// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./my_model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    loadModel();
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}


//permitir submeter um arquivo para predição 


async function loadModel() {
    const modelURL = URL + & quot; model.json & quot;;
    const metadataURL = URL + & quot; metadata.json & quot;;
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file
    picker
        // or files from your local hard drive
        // Note: the pose library adds &quot;tmImage&quot; object to your window
        (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById(& quot; label - container & quot;);
}

async function predictFromFile() {
    const fileInput = document.getElementById(&#39; file - input &#39;);
    const previewContainer = document.getElementById(&#39; file - preview - container &#39;);

    if (fileInput.files & amp;& amp; fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            previewContainer.innerHTML = `&lt;img id=&quot;target-image&quot;
src=&quot;${e.target.result}&quot; width=&quot;200&quot; style=&quot;border-radius: 8px;&quot;&gt;`;
            const imgElement = document.getElementById(&#39; target -
                image &#39;);
            imgElement.onload = async() =& gt; {
                await runStaticPrediction(imgElement);
            };
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

/**
 * Função: Executa a predição em um elemento de imagem estático
 * @param {HTMLImageElement} imgElement
 */
async function runStaticPrediction(imgElement) {
    if (model == null)
        await loadModel();

    const prediction = await model.predict(imgElement);
    predictClass(prediction);

}