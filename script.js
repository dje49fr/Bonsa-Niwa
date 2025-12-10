// Configuration des actions
const ACTION_TYPES = {
    taille: "Taille",
    rempotage: "Rempotage",
    effeuillage: "Effeuillage",
    ligature: "Ligature",
    prelevement: "Prélèvement",
    engrais: "Engrais"
};

const STORAGE_KEY = 'niwaData_v3_final'; // Nouvelle clé pour démarrer la DB IndexedDB
let bonsais = [];

// Initialisation de localForage (IndexedDB)
localforage.config({
    name: 'BonsaisNiwaDB',
    storeName: 'bonsai_fiches',
    description: 'Stockage des fiches de bonsaïs, y compris les photos Base64.'
});


// -------------------------------------------------------------------
// ASYNCHRONE: FONCTIONS DE GESTION DES DONNÉES (IndexedDB)
// -------------------------------------------------------------------

async function saveData() {
    try {
        await localforage.setItem(STORAGE_KEY, bonsais);
    } catch (err) {
        console.error("Erreur de sauvegarde IndexedDB:", err);
        alert("Erreur de sauvegarde : l'espace de stockage est peut-être saturé.");
    }
}

async function loadData() {
    try {
        const data = await localforage.getItem(STORAGE_KEY);
        bonsais = data || [];
        renderBonsais();
    } catch (err) {
        console.error("Erreur de lecture IndexedDB:", err);
        bonsais = [];
        renderBonsais();
    }
}


// -------------------------------------------------------------------
// LOGIQUE DE REDIMENSIONNEMENT (Pour stabiliser le chargement photo)
// -------------------------------------------------------------------

function resizeImage(file, maxWidth, maxHeight, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const image = new Image();
            image.onload = () => {
                let width = image.width;
                let height = image.height;

                // Redimensionnement pour ne pas dépasser 512px
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                // Création du canevas
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, width, height);

                // Conversion en Base64 JPEG (plus compact)
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            image.onerror = () => reject("Erreur de chargement d'image");
            image.src = readerEvent.target.result;
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}


// -------------------------------------------------------------------
// LOGIQUE DE L'APPLICATION
// -------------------------------------------------------------------

function toggleAddForm(show) {
    const overlay = document.getElementById('addFormOverlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
        // Réinitialisation des champs à la fermeture
        document.getElementById('nameInput').value = '';
        document.getElementById('speciesInput').value = '';
        document.getElementById('photoInput').value = null; 
        document.getElementById('imagePreview').style.display = 'none';
    }
}


function previewImage() {
    const fileInput = document.getElementById('photoInput');
    const preview = document.getElementById('imagePreview');
    
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        if(preview) {
            preview.style.display = 'none';
            preview.src = '';
        }
    }
}

function renderBonsais() {
    const list = document.getElementById('bonsaiList');
    list.innerHTML = '';

    bonsais.forEach((bonsai, index) => {
        const div = document.createElement('div');
        div.className = 'bonsai-grid-item'; 

        const imageSrc = bonsai.photoBase64 
            ? bonsai.photoBase64
            : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ccc" d="M576 109.5v352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v-352c0-35.3 28.7-64 64-64h448c35.3 0 64 28.7 64 64zM64 432h448V109.5c0-10.6-8.6-19.2-19.2-19.2H83.2c-10.6 0-19.2 8.6-19.2 19.2V432zM320 224a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"/></svg>';
        
        let badgesHTML = '';
        const actionsDone = Object.keys(bonsai.actions).filter(key => bonsai.actions[key] !== null);
        const recentActions = actionsDone.sort((a, b) => new Date(bonsai.actions[b]) - new Date(bonsai.actions[a])).slice(0, 3);

        recentActions.forEach(key => {
            const label = ACTION_TYPES[key];
            badgesHTML += `<span class="action-badge" title="${label} : ${new Date(bonsai.actions[key]).toLocaleDateString()}">${label}</span>`;
        });
        
        if (recentActions.length === 0) {
            badgesHTML = `<span class="action-badge" style="background:#f9f9f9; color:#999;">Pas d'actions</span>`;
        }

        let optionsHTML = '';
        for (const [key, label] of Object.entries(ACTION_TYPES)) {
            optionsHTML += `<option value="${key}">${label}</option>`;
        }
        
        div.innerHTML = `
            <img src="${imageSrc}" class="bonsai-image-grid" alt="Photo de ${bonsai.name}">
            
            <div class="bonsai-info-grid">
                <h3>${bonsai.name}</h3>
                <span class="species">${bonsai.species}</span>
                <div class="action-badges">${badgesHTML}</div>
            </div>
            
            <div class="action-control-overlay">
                <select id="action-select-${index}">${optionsHTML}</select>
                <button onclick="performAction(${index})" class="btn-act" title="Noter l'action"><i class="fas fa-check"></i></button>
                <button onclick="deleteBonsai(${index})" class="btn-delete" title="Supprimer l'arbre"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function saveAndReset() {
    saveData();
    renderBonsais();
    toggleAddForm(false);
    
    const addButton = document.querySelector('.btn-primary');
    if(addButton) {
        addButton.disabled = false;
        addButton.textContent = 'Ajouter au jardin';
    }
}

async function addBonsai() {
    const nameInput = document.getElementById('nameInput');
    const speciesInput = document.getElementById('speciesInput');
    const fileInput = document.getElementById('photoInput');
    const addButton = document.querySelector('.btn-primary');

    if (!nameInput.value) {
        alert("Il faut donner un nom à l'arbre !");
        return;
    }
    
    const newBonsai = {
        name: nameInput.value,
        species: speciesInput.value,
        photoBase64: null, 
        actions: {}
    };

    if (fileInput.files && fileInput.files[0]) {
        
        addButton.disabled = true;
        addButton.textContent = 'Optimisation de la photo...'; 

        try {
            // Utilisation de la fonction de redimensionnement pour stabiliser
            newBonsai.photoBase64 = await resizeImage(fileInput.files[0], 512, 512, 0.8);
            
            bonsais.unshift(newBonsai); 
            saveAndReset();

        } catch(error) {
            console.error("Erreur d'optimisation de la photo :", error);
            alert("Erreur lors du traitement de la photo. Ajout sans photo.");
            bonsais.unshift(newBonsai); 
            saveAndReset();
        }
        
    } else {
        // Pas de photo, ajout immédiat
        bonsais.unshift(newBonsai);
        saveAndReset();
    }
}

async function performAction(index) {
    const selectBox = document.getElementById(`action-select-${index}`);
    const selectedAction = selectBox.value;
    
    bonsais[index].actions[selectedAction] = new Date();
    await saveData();
    renderBonsais();
}

async function deleteBonsai(index) {
    if(confirm('Supprimer définitivement cet arbre et son historique ?')) {
        bonsais.splice(index, 1);
        await saveData();
        renderBonsais();
    }
}

async function resetData() {
    if(confirm("Attention : Cela va effacer TOUT votre jardin (arbres et photos). Continuer ?")) {
        try {
            // Utilisation de localForage pour effacer la DB
            await localforage.clear(); 
            bonsais = [];
            renderBonsais();
            alert("Le jardin a été effacé avec succès.");
        } catch(err) {
            alert("Erreur lors de l'effacement du jardin.");
        }
    }
}

// Lancement au démarrage : Charger les données
loadData();
