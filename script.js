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

// --- Fonctions d'affichage et de prévisualisation ---

// Affiche la photo sélectionnée dans le formulaire avant l'ajout
function previewImage() {
    const fileInput = document.getElementById('photoInput');
    const preview = document.getElementById('imagePreview');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            // Affiche l'image dans l'aperçu, mais NE stocke PAS le Base64 globalement.
            preview.src = e.target.result;
            preview.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        preview.src = '';
    }
}

// Nouvelle fonction qui lit la photo et renvoie une promesse (pour attendre la conversion)
function readImageAsBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null); // Pas de fichier = pas de Base64, on continue
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (error) => reject(error);
        
        reader.readAsDataURL(file);
    });
}


function renderBonsais() {
    const list = document.getElementById('bonsaiList');
    list.innerHTML = '';

    bonsais.forEach((bonsai, index) => {
        const div = document.createElement('div');
        div.className = 'bonsai-grid-item'; 

        // Image : utilise l'image ou une icône générique si elle manque
        const imageSrc = bonsai.photoBase64 
            ? bonsai.photoBase64
            : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ccc" d="M576 109.5v352c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v-352c0-35.3 28.7-64 64-64h448c35.3 0 64 28.7 64 64zM64 432h448V109.5c0-10.6-8.6-19.2-19.2-19.2H83.2c-10.6 0-19.2 8.6-19.2 19.2V432zM320 224a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"/></svg>';
        
        // Affichage des badges d'actions (Max 3 actions récentes)
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

// --- Fonctions d'action et de sauvegarde ---

// L'ajout de fiche devient asynchrone pour attendre la photo
async function addBonsai() {
    const nameInput = document.getElementById('nameInput');
    const speciesInput = document.getElementById('speciesInput');
    const fileInput = document.getElementById('photoInput');

    if (!nameInput.value) {
        alert("Il faut donner un nom à l'arbre !");
        return;
    }
    
    // Désactiver le bouton pendant le chargement (surtout pour les grosses photos)
    const addButton = document.querySelector('.btn-primary');
    addButton.disabled = true;
    addButton.textContent = 'Chargement...';

    // 1. Lire l'image en Base64 et attendre que ce soit terminé
    let photoBase64 = null;
    if (fileInput.files && fileInput.files[0]) {
        try {
            photoBase64 = await readImageAsBase64(fileInput.files[0]);
        } catch (error) {
            console.error("Erreur lors de la lecture du fichier photo:", error);
            alert("Erreur lors du chargement de la photo. Veuillez réessayer.");
            addButton.disabled = false;
            addButton.textContent = 'Ajouter au jardin';
            return;
        }
    }

    // 2. Créer la nouvelle fiche
    const newBonsai = {
        name: nameInput.value,
        species: speciesInput.value,
        photoBase64: photoBase64, // <-- Maintenant, on est sûr que la photoBase64 est prête
        actions: {}
    };

    bonsais.unshift(newBonsai);
    saveData();
    renderBonsais();
    
    // 3. Réinitialisation du formulaire
    nameInput.value = '';
    speciesInput.value = '';
    fileInput.value = null; // Efface le champ file
    document.getElementById('imagePreview').style.display = 'none';
    
    addButton.disabled = false;
    addButton.textContent = 'Ajouter au jardin';
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
