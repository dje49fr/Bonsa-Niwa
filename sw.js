// Configuration des actions (inchangée)
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

// -------------------------------------------------------------------
// Fonction pour gérer l'ouverture/fermeture du formulaire
// -------------------------------------------------------------------

function toggleAddForm(show) {
    const overlay = document.getElementById('addFormOverlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
        // Réinitialiser les champs et l'aperçu à la fermeture (pour le bug)
        document.getElementById('nameInput').value = '';
        document.getElementById('speciesInput').value = '';
        document.getElementById('photoInput').value = null; 
        document.getElementById('imagePreview').style.display = 'none';
    }
}


// --- Fonctions d'affichage et de prévisualisation ---

function previewImage() {
    const fileInput = document.getElementById('photoInput');
    const preview = document.getElementById('imagePreview');
    
    // Ajout d'une vérification pour s'assurer que l'input et les fichiers existent
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        if(preview) { // Vérification de sécurité
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


// -------------------------------------------------------------------
// FONCTIONS DE SAUVEGARDE ET LOGIQUE D'AJOUT (CONSOLIDÉE)
// -------------------------------------------------------------------

function saveAndReset() {
    saveData();
    renderBonsais();
    toggleAddForm(false); // FERMER l'overlay
    
    // Rétablir le bouton au cas où il était en "Chargement..."
    const addButton = document.querySelector('.btn-primary');
    if(addButton) {
        addButton.disabled = false;
        addButton.textContent = 'Ajouter au jardin';
    }
}

function addBonsai() {
    const nameInput = document.getElementById('nameInput');
    const speciesInput = document.getElementById('speciesInput');
    const fileInput = document.getElementById('photoInput');
    const addButton = document.querySelector('.btn-primary');

    if (!nameInput.value) {
        alert("Il faut donner un nom à l'arbre !");
        return;
    }
    
    // 1. Initialiser la fiche
    const newBonsai = {
        name: nameInput.value,
        species: speciesInput.value,
        photoBase64: null, 
        actions: {}
    };

    // 2. Traitement du fichier photo
    if (fileInput.files && fileInput.files[0]) {
        
        // Mettre à jour l'état du bouton pendant le chargement
        addButton.disabled = true;
        addButton.textContent = 'Chargement photo...';

        const reader = new FileReader();

        reader.onload = function(e) {
            newBonsai.photoBase64 = e.target.result;
            bonsais.unshift(newBonsai); 
            saveAndReset();
        };

        reader.onerror = function() {
            alert("Erreur lors de la lecture de la photo. Ajout sans photo.");
            bonsais.unshift(newBonsai); 
            saveAndReset();
        }

        reader.readAsDataURL(fileInput.files[0]);
        
    } else {
        // 3. Pas de photo, ajout immédiat
        bonsais.unshift(newBonsai);
        saveAndReset();
    }
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
