// Configuration des actions
const ACTION_TYPES = {
    taille: "Taille",
    rempotage: "Rempotage",
    effeuillage: "Effeuillage",
    ligature: "Ligature",
    prelevement: "Prélèvement",
    engrais: "Engrais" // J'ai rajouté l'engrais, c'est utile !
};

// Clé unique pour ton appli Niwa
const STORAGE_KEY = 'niwaData_v1';

let bonsais = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function renderBonsais() {
    const list = document.getElementById('bonsaiList');
    list.innerHTML = '';

    bonsais.forEach((bonsai, index) => {
        const div = document.createElement('div');
        div.className = 'card';

        // Affichage des dates
        let actionsHTML = '<div class="action-grid">';
        for (const [key, label] of Object.entries(ACTION_TYPES)) {
            const dateVal = bonsai.actions[key];
            if (dateVal) { // On n'affiche que ce qui a déjà été fait pour alléger
                const dateDisplay = new Date(dateVal).toLocaleDateString('fr-FR');
                actionsHTML += `
                    <div class="action-row">
                        <span class="action-label">${label}</span>
                        <span class="action-date">${dateDisplay}</span>
                    </div>
                `;
            }
        }
        // Message si rien n'est fait
        if (actionsHTML === '<div class="action-grid">') {
            actionsHTML += '<div class="action-row" style="justify-content:center; color:#999;">Aucun historique récent</div>';
        }
        actionsHTML += '</div>';

        // Menu déroulant
        let optionsHTML = '';
        for (const [key, label] of Object.entries(ACTION_TYPES)) {
            optionsHTML += `<option value="${key}">${label}</option>`;
        }

        div.innerHTML = `
            <h3>${bonsai.name}</h3>
            <span class="species">${bonsai.species}</span>
            
            ${actionsHTML}

            <div class="action-control">
                <select id="action-select-${index}">${optionsHTML}</select>
                <button onclick="performAction(${index})" class="btn-act"><i class="fas fa-check"></i></button>
                <button onclick="deleteBonsai(${index})" class="btn-delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function addBonsai() {
    const name = document.getElementById('nameInput').value;
    const species = document.getElementById('speciesInput').value;

    if (!name) return alert("Il faut donner un nom à l'arbre.");

    const newBonsai = {
        name: name,
        species: species,
        actions: {} // Objet vide au départ
    };

    bonsais.unshift(newBonsai); // Ajoute au début de la liste
    saveData();
    renderBonsais();
    
    document.getElementById('nameInput').value = '';
    document.getElementById('speciesInput').value = '';
}

function performAction(index) {
    const selectBox = document.getElementById(`action-select-${index}`);
    const selectedAction = selectBox.value;
    
    bonsais[index].actions[selectedAction] = new Date();
    saveData();
    renderBonsais();
}

function deleteBonsai(index) {
    if(confirm('Supprimer définitivement ?')) {
        bonsais.splice(index, 1);
        saveData();
        renderBonsais();
    }
}

function resetData() {
    if(confirm("Attention : Cela va effacer tout ton jardin. Continuer ?")) {
        localStorage.removeItem(STORAGE_KEY);
        bonsais = [];
        renderBonsais();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bonsais));
}

renderBonsais();
