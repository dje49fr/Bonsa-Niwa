// Configuration des actions
const ACTION_TYPES = {
    taille: "Taille",
    rempotage: "Rempotage",
    effeuillage: "Effeuillage",
    ligature: "Ligature",
    prelevement: "Prélèvement",
    engrais: "Engrais"
};

const STORAGE_KEY = 'niwaData_v2_with_photos'; 

let bonsais = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentImageBase64 = null; // Variable pour stocker la photo du formulaire

// --- Fonctions d'affichage et de prévisualisation (inchangées) ---

function previewImage() {
    const fileInput = document.getElementById('photoInput');
    const preview = document.getElementById('imagePreview');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            currentImageBase64 = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        preview.src = '';
        currentImageBase64 = null;
    }
}


function renderBonsais() {
    const list = document.getElementById('bonsaiList');
    list.innerHTML = '';

    bonsais.forEach((bonsai, index) => {
        const div = document.createElement('div');
        div.className = 'bonsai-grid-item'; // Nouvelle classe pour la mosaïque

        // Image : utilise l'image ou une icône générique si elle manque
        const imageSrc = bonsai.photoBase64 
            ? bonsai.photoBase64
            : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ccc" d="M576 109.5v352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v-352c0-35.3 28.7-64 64-64h448c35.3 0 64 28.7 64 64zM64 432h448V109.5c0-10.6-8.6-19.2-19.2-19.2H83.2c-10.6 0-19.2 8.6-19.2 19.2V432zM320 224a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"/></svg>';
        
        // Affichage des badges d'actions (Max 3 actions récentes)
        let badgesHTML = '';
        const actionsDone = Object.keys(bonsai.actions).filter(key => bonsai.actions[key] !== null);
        
        // Afficher seulement les 3 dernières actions
        const recentActions = actionsDone.sort((a, b) => new Date(bonsai.actions[b]) - new Date(bonsai.actions[a])).slice(0, 3);

        recentActions.forEach(key => {
            const label = ACTION_TYPES[key];
            badgesHTML += `<span class="action-badge" title="${label} : ${new Date(bonsai.actions[key]).toLocaleDateString()}">${label}</span>`;
        });
        
        if (recentActions.length === 0) {
            badgesHTML = `<span class="action-badge" style="background:#f9f9f9; color:#999;">Pas d'actions</span>`;
        }

        // Menu déroulant (inchangé)
        let optionsHTML = '';
        for (const [key, label] of Object.entries(ACTION_TYPES)) {
            optionsHTML += `<option value="${key}">${label}</option>`;
        }
        
        // Structure de la carte en mosaïque
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

// --- Fonctions d'action et de sauvegarde (inchangées) ---

function addBonsai() {
    const name = document.getElementById('nameInput').value;
    const species = document.getElementById('speciesInput').value;

    if (!name) return alert("Il faut donner un nom à l'arbre.");

    const newBonsai = {
        name: name,
        species: species,
        photoBase64: currentImageBase64, 
        actions: {}
    };

    bonsais.unshift(newBonsai);
    saveData();
    renderBonsais();
    
    // Réinitialisation du formulaire
    document.getElementById('nameInput').value = '';
    document.getElementById('speciesInput').value = '';
    document.getElementById('photoInput').value = null; 
    document.getElementById('imagePreview').style.display = 'none';
    currentImageBase64 = null;
}

function performAction(index) {
    const selectBox = document.getElementById(`action-select-${index}`);
    const selectedAction = selectBox.value;
    
    bonsais[index].actions[selectedAction] = new Date();
    saveData();
    renderBonsais();
}

function deleteBonsai(index) {
    if(confirm('Supprimer définitivement cet arbre et son historique ?')) {
        bonsais.splice(index, 1);
        saveData();
        renderBonsais();
    }
}

function resetData() {
    if(confirm("Attention : Cela va effacer TOUT votre jardin (arbres et photos). Continuer ?")) {
        localStorage.removeItem(STORAGE_KEY);
        bonsais = [];
        renderBonsais();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bonsais));
}

// Lancement au démarrage
renderBonsais();
