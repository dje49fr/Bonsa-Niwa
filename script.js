// Configuration des types d'actions (HISTORIQUE)
const ACTION_TYPES = {
    taille: "Taille de maintien",
    rempotage: "Rempotage",
    effeuillage: "Effeuillage",
    ligature: "Ligature",
    engrais: "Engrais" 
};

// Configuration des types d'interventions futures (CALENDRIER PRÉVU)
const FUTURE_ACTIONS = {
    rempotage: "Rempotage prévu",
    engrais: "Prochain apport d'engrais",
    taille: "Taille de structure / Pinçage"
};

const STORAGE_KEY = 'niwaData_v2'; 

let bonsais = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentBonsaiIndex = null; // Pour suivre l'arbre actuellement affiché

// =======================================================
// AFFICHER/CACHER LA FICHE DÉTAILLÉE (MODAL)
// =======================================================

function showDetails(index) {
    currentBonsaiIndex = index;
    const bonsai = bonsais[index];

    // 1. Informations de base
    document.getElementById('detailName').textContent = bonsai.name;
    document.getElementById('detailSpecies').textContent = bonsai.species || 'Non spécifié';
    document.getElementById('detailPurchaseDate').textContent = bonsai.purchaseDate || 'Inconnue';

    // 2. Historique des actions (Actions passées)
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    // Remplir le select pour l'ajout d'une action passée
    let pastActionOptions = '';
    for (const [key, label] of Object.entries(ACTION_TYPES)) {
        pastActionOptions += `<option value="${key}">${label}</option>`;
    }
    document.getElementById('pastActionSelect').innerHTML = pastActionOptions;

    // Affichage des actions passées
    for (const [key, date] of Object.entries(bonsai.history)) {
        if (date) {
            const dateDisplay = new Date(date).toLocaleDateString('fr-FR');
            historyList.innerHTML += `<div class="action-row"><span class="action-label">${ACTION_TYPES[key] || key}</span><span class="action-date">${dateDisplay}</span></div>`;
        }
    }
    if (historyList.innerHTML === '') historyList.innerHTML = '<p class="no-entry">Aucune intervention enregistrée.</p>';

    // 3. Calendrier futur (Interventions prévues)
    const futureList = document.getElementById('futureList');
    futureList.innerHTML = '';
    
    // Ajout des options pour le SELECT futur
    let futureOptions = '';
    for (const [key, label] of Object.entries(FUTURE_ACTIONS)) {
        futureOptions += `<option value="${key}">${label}</option>`;
    }
    document.getElementById('futureActionSelect').innerHTML = futureOptions;

    // Affichage des dates déjà prévues
    for (const [key, date] of Object.entries(bonsai.futurePlan)) {
        if (date) {
            const dateDisplay = new Date(date).toLocaleDateString('fr-FR');
            futureList.innerHTML += `<div class="action-row"><span class="action-label">${FUTURE_ACTIONS[key] || key}</span><span class="action-date">${dateDisplay}</span><button onclick="deleteFutureAction('${key}')" class="btn-delete-small"><i class="fas fa-times"></i></button></div>`;
        }
    }
    if (futureList.innerHTML === '') futureList.innerHTML = '<p class="no-entry">Aucune intervention future planifiée.</p>';

    // 4. Espace Notes/Intervention
    document.getElementById('notesArea').value = bonsai.notes || '';

    document.getElementById('detailModal').style.display = 'flex';
}

function hideDetails() {
    // Sauvegarde des notes avant de cacher
    saveNotes(); 
    document.getElementById('detailModal').style.display = 'none';
    currentBonsaiIndex = null;
}

// =======================================================
// GESTION DES DONNÉES
// =======================================================

function renderBonsais() {
    const list = document.getElementById('bonsaiList');
    list.innerHTML = '';

    bonsais.forEach((bonsai, index) => {
        const div = document.createElement('div');
        div.className = 'card';

        // Affichage simplifié pour la liste principale
        let historyPreview = 'Pas d\'historique.';
        // Trouver la dernière action effectuée
        const actionsDates = Object.entries(bonsai.history).map(([key, date]) => ({key, date: new Date(date)})).filter(item => !isNaN(item.date));
        actionsDates.sort((a, b) => b.date - a.date);
        
        if (actionsDates.length > 0) {
            const lastAction = actionsDates[0];
            historyPreview = `${ACTION_TYPES[lastAction.key] || lastAction.key} : ${lastAction.date.toLocaleDateString('fr-FR')}`;
        }


        div.innerHTML = `
            <h3>${bonsai.name}</h3>
            <span class="species">${bonsai.species || 'Espèce non renseignée'}</span>
            <p class="history-preview">Dernière action : ${historyPreview}</p>
            <div class="card-controls">
                <button onclick="showDetails(${index})" class="btn-secondary"><i class="fas fa-info-circle"></i> Fiche complète</button>
                <button onclick="deleteBonsai(${index})" class="btn-delete-small"><i class="fas fa-trash"></i></button>
            </div>
        `;
        list.appendChild(div);
    });
}

function addBonsai() {
    const name = document.getElementById('nameInput').value;
    const species = document.getElementById('speciesInput').value;
    const purchaseDate = document.getElementById('purchaseDateInput').value; 

    if (!name) return alert("Il faut donner un nom à l'arbre.");

    const newBonsai = {
        name: name,
        species: species,
        purchaseDate: purchaseDate,
        history: {},     // Historique des actions passées (type: date)
        futurePlan: {},  // Calendrier des interventions futures (type: date)
        notes: ''        // Espace de notes
    };

    bonsais.unshift(newBonsai); 
    saveData();
    renderBonsais();
    
    // Nettoyage
    document.getElementById('nameInput').value = '';
    document.getElementById('speciesInput').value = '';
    document.getElementById('purchaseDateInput').value = '';
}

function performAction() {
    if (currentBonsaiIndex === null) return;
    
    const selectedAction = document.getElementById('pastActionSelect').value;
    
    // On enregistre l'action dans l'historique (history) avec la date d'aujourd'hui
    bonsais[currentBonsaiIndex].history[selectedAction] = new Date().toISOString().split('T')[0];
    saveData();
    showDetails(currentBonsaiIndex); // Rafraîchit la fiche
    renderBonsais(); // Rafraîchit la liste principale
}

function addFutureAction() {
    if (currentBonsaiIndex === null) return;
    
    const action = document.getElementById('futureActionSelect').value;
    const date = document.getElementById('futureDateInput').value;

    if (!date) return alert("Veuillez choisir une date pour l'intervention future.");
    
    bonsais[currentBonsaiIndex].futurePlan[action] = date;
    saveData();
    showDetails(currentBonsaiIndex); // Rafraîchit la fiche
}

function deleteFutureAction(actionType) {
    if (currentBonsaiIndex === null) return;

    delete bonsais[currentBonsaiIndex].futurePlan[actionType];
    saveData();
    showDetails(currentBonsaiIndex); // Rafraîchit la fiche
}

function saveNotes() {
    if (currentBonsaiIndex === null) return;
    bonsais[currentBonsaiIndex].notes = document.getElementById('notesArea').value;
    saveData();
}


function deleteBonsai(index) {
    if(confirm('Supprimer définitivement cet arbre ?')) {
        bonsais.splice(index, 1);
        saveData();
        renderBonsais();
        hideDetails(); // Assurez-vous de cacher la fiche si elle était ouverte
    }
}

function resetData() {
    if(confirm("Attention : Cela va effacer tout ton jardin. Continuer ?")) {
        localStorage.removeItem(STORAGE_KEY);
        bonsais = [];
        renderBonsais();
        hideDetails();
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bonsais));
}

renderBonsais();
