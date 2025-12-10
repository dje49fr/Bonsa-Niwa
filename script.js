// Configuration des actions
const ACTION_TYPES = {
    taille: "Taille",
    rempotage: "Rempotage",
    effeuillage: "Effeuillage",
    ligature: "Ligature",
    prelevement: "Prélèvement",
    engrais: "Engrais"
};

const STORAGE_KEY = 'niwaData_v2_with_photos'; // Nouvelle clé de stockage

let bonsais = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentImageBase64 = null; // Variable pour stocker la photo du formulaire

// --- Fonctions d'affichage et de prévisualisation ---

// Affiche la photo sélectionnée dans le formulaire avant l'ajout
function previewImage() {
    const fileInput = document.getElementById('photoInput');
    const preview = document.getElementById('imagePreview');
    
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            // 1. Affiche l'image dans l'aperçu du formulaire
            preview.src = e.target.result;
            preview.style.display = 'block';
            
            // 2. Stocke la chaîne Base64 pour l'ajout
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
        div.className = 'card';

        // Gérer l'affichage de l'image et du texte dans le header
        const imageHTML = bonsai.photoBase64 
            ? `<img src="${bonsai.photoBase64}" class="bonsai-image" alt="${bonsai.name}">`
            : '';
            
        // Affichage des dates (inchangé)
        let actionsHTML = '<div class="action-grid">';
        for (const [key, label] of Object.entries(ACTION_TYPES)) {
            const dateVal = bonsai.actions[key];
            if (dateVal) { 
                const dateDisplay = new Date(dateVal).toLocaleDateString('fr-FR');
                actionsHTML += `
                    <div class="action-row">
                        <span class="action-label">${label}</span>
                        <span class="action-date">${dateDisplay}</span>
                    </div>
                `;
            }
        }
        if (actionsHTML === '<div class="action-grid">') {
            actionsHTML += '<div class="action-row" style="justify-content:center; color:#999;">Aucun historique enregistré</div>';
        }
        actionsHTML += '</div>';

        // Menu déroulant (inchangé)
        let optionsHTML = '';
        for (const [key, label] of Object.entries(ACTION_TYPES)) {
            optionsHTML += `<option value="${key}">${label}</option>`;
        }

        div.innerHTML = `
            <div class="bonsai-header">
                ${imageHTML}
                <h3>${bonsai.name}</h3>
                <span class="species">${bonsai.species}</span>
            </div>
            
            ${actionsHTML}

            <div class="action-control">
                <select id="action-select-${index}">${optionsHTML}</select>
                <button onclick="performAction(${index})" class="btn-act" title="Noter l'action"><i class="fas fa-check"></i></button>
                <button onclick="deleteBonsai(${index})" class="btn-delete" title="Supprimer l'arbre"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

// --- Fonctions d'action et de sauvegarde ---

function addBonsai() {
    const name = document.getElementById('nameInput').value;
    const species = document.getElementById('speciesInput').value;

    if (!name) return alert("Il faut donner un nom à l'arbre.");

    const newBonsai = {
        name: name,
        species: species,
        photoBase64: currentImageBase64, // <-- Ajout de la photo ici
        actions: {}
    };

    bonsais.unshift(newBonsai);
    saveData();
    renderBonsais();
    
    // Réinitialisation du formulaire
    document.getElementById('nameInput').value = '';
    document.getElementById('speciesInput').value = '';
    document.getElementById('photoInput').value = null; // Efface le champ file
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
