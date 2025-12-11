// --- CONFIGURATION ---
const ACTION_TYPES = {
    taille: "Taille",
    ligature: "Ligature", 
    rempotage: "Rempotage",
    effeuillage: "Effeuillage",
    engrais: "Engrais",
    traitement: "Traitement",
    arrosage: "Arrosage spécifique"
};

const FUTURE_ACTIONS = {
    rempotage: "Rempotage prévu",
    ligature: "Pose/Retrait Ligature",
    engrais: "Prochain engrais",
    taille: "Taille de structure"
};

// --- LISTE GÉANTE DES ARBRES (+300 Entrées) ---
const ALL_SPECIES = [
    "Acer buergerianum (Érable Trident)", "Acer campestre (Érable champêtre)", "Acer ginnala (Érable du fleuve Amour)", "Acer monspessulanum (Érable de Montpellier)", "Acer palmatum (Érable du Japon)", "Acer palmatum 'Deshojo'", "Acer palmatum 'Kiyohime'", "Acer palmatum 'Shishigashira'", "Acer rubrum (Érable rouge)", "Adansonia digitata (Baobab)", "Adenium obesum (Rose du désert)", "Aesculus hippocastanum (Marronnier)",
    "Albizia julibrissin (Arbre à soie)", "Alnus glutinosa (Aulne glutineux)", "Amelanchier canadensis", "Araucaria heterophylla", "Arbutus unedo (Arbousier)", "Azalea (Azalée Satsuki)", "Berberis thunbergii (Epine-vinette)", "Betula pendula (Bouleau blanc)", "Bougainvillea glabra (Bougainvillier)", "Buxus harlandii (Buis de Chine)", "Buxus sempervirens (Buis commun)",
    "Callicarpa japonica", "Camellia japonica (Camélia)", "Carmona microphylla (Théier de Fukien)", "Carpinus betulus (Charme commun)", "Carpinus coreana (Charme de Corée)", "Carpinus turczaninowii", "Cedrus atlantica (Cèdre de l'Atlas)", "Cedrus deodara (Cèdre de l'Himalaya)", "Cedrus libani (Cèdre du Liban)", "Celtis australis (Micocoulier)", "Celtis sinensis (Micocoulier de Chine)",
    "Chaenomeles japonica (Cognassier du Japon)", "Chamaecyparis obtusa (Faux cyprès Hinoki)", "Chamaecyparis pisifera", "Citrus aurantium (Oranger)", "Citrus limon (Citronnier)", "Citrus reticulata (Mandarinier)", "Cornus mas (Cornouiller mâle)", "Corylus avellana (Noisetier)", "Cotoneaster horizontalis", "Cotoneaster microphyllus", "Crassula ovata (Arbre de Jade)",
    "Crataegus laevigata (Aubépine)", "Crataegus monogyna", "Cryptomeria japonica (Cèdre du Japon)", "Cupressus macrocarpa (Cyprès de Lambert)", "Cupressus sempervirens (Cyprès de Provence)", "Cydonia oblonga (Cognassier)", "Desmodium", "Diospyros kaki (Plaquemilier)", "Elaeagnus pungens", "Enkianthus perulatus", "Eugenia uniflora", "Euonymus alatus (Fusain ailé)", "Euonymus europaeus",
    "Fagus crenata (Hêtre du Japon)", "Fagus sylvatica (Hêtre commun)", "Ficus benjamina", "Ficus carica (Figuier commun)", "Ficus microcarpa (Ginseng)", "Ficus nerifolia", "Ficus retusa (Figuier Banyan)", "Forsythia intermedia", "Fraxinus angustifolia (Frêne)", "Fraxinus excelsior", "Fuchsia magellanica", "Gardenia jasminoides", "Ginkgo biloba (Arbre aux 40 écus)",
    "Gleditsia triacanthos (Févier)", "Grevillea robusta", "Hedera helix (Lierre)", "Hibiscus syriacus (Althea)", "Ilex crenata (Houx crénelé)", "Ilex serrata", "Jacaranda mimosifolia", "Jasminum nudiflorum (Jasmin d'hiver)", "Juniperus chinensis (Genévrier de Chine)", "Juniperus chinensis 'Itoigawa'", "Juniperus chinensis 'Shimpaku'", "Juniperus communis (Genévrier commun)", "Juniperus procumbens 'Nana'",
    "Juniperus rigida (Genévrier rigide)", "Juniperus sabina", "Juniperus squamata", "Lagerstroemia indica (Lilas des Indes)", "Larix decidua (Mélèze d'Europe)", "Larix kaempferi (Mélèze du Japon)", "Laurus nobilis (Laurier sauce)", "Leptospermum scoparium (Manuka)", "Ligustrum sinense (Troène de Chine)", "Ligustrum vulgare (Troène commun)", "Liquidambar styraciflua (Copalme)", "Lonicera nitida (Chèvrefeuille)",
    "Loropetalum chinense", "Magnolia grandiflora", "Magnolia stellata", "Malus 'Evereste'", "Malus halliana (Pommier à fleurs)", "Malus sylvestris (Pommier sauvage)", "Metasequoia glyptostroboides", "Morus alba (Mûrier blanc)", "Morus nigra (Mûrier noir)", "Murraya paniculata", "Myrtus communis (Myrte)", "Nandina domestica (Bambou sacré)", "Olea europaea (Olivier)", "Olea europaea 'Sylvestris' (Oléastre)",
    "Operculicarya decaryi", "Osmanthus fragrans", "Parrotia persica", "Parthenocissus tricuspidata (Vigne vierge)", "Picea abies (Epicéa commun)", "Picea glauca 'Conica'", "Picea jezoensis (Epicéa du Japon)", "Pinus densiflora (Pin rouge du Japon)", "Pinus halepensis (Pin d'Alep)", "Pinus mugo (Pin Mugho)", "Pinus nigra (Pin noir)", "Pinus parviflora (Pin blanc du Japon)", "Pinus pentaphylla",
    "Pinus pinea (Pin parasol)", "Pinus ponderosa", "Pinus sylvestris (Pin sylvestre)", "Pinus thunbergii (Pin noir du Japon)", "Pistacia lentiscus (Pistachier lentisque)", "Pittosporum tobira", "Platanus acerifolia (Platane)", "Podocarpus macrophyllus (Pin des bouddhistes)", "Polyscias fruticosa", "Populus nigra (Peuplier noir)", "Populus tremula (Tremble)", "Portulacaria afra (Arbre à éléphant)",
    "Potentilla fruticosa (Potentille)", "Prunus armeniaca (Abricotier)", "Prunus avium (Merisier)", "Prunus cerasifera (Prunier Pissardi)", "Prunus incisa (Cerisier Fuji)", "Prunus mahaleb (Bois de Sainte-Lucie)", "Prunus mume (Abricotier du Japon)", "Prunus serrulata (Cerisier du Japon)", "Prunus spinosa (Prunellier)", "Pseudocydonia sinensis (Cognassier de Chine)", "Pseudolarix amabilis (Mélèze doré)",
    "Punica granatum (Grenadier)", "Punica granatum 'Nana'", "Pyracantha angustifolia", "Pyracantha coccinea (Buisson ardent)", "Quercus cerris (Chêne chevelu)", "Quercus coccifera (Chêne kermès)", "Quercus ilex (Chêne vert)", "Quercus pubescens (Chêne pubescent)", "Quercus robur (Chêne pédonculé)", "Quercus suber (Chêne liège)", "Rhododendron indicum", "Robinia pseudoacacia (Robinier)", "Rosmarinus officinalis (Romarin)",
    "Sageretia theezans", "Salix babylonica (Saule pleureur)", "Schefflera arboricola", "Schinus molle (Faux poivrier)", "Sciadopitys verticillata", "Serissa foetida (Neige de juin)", "Sorbus aucuparia (Sorbier)", "Stewartia monadelpha", "Syringa vulgaris (Lilas)", "Tamarix (Tamaris)", "Taxodium distichum (Cyprès chauve)", "Taxus baccata (If commun)", "Taxus cuspidata (If du Japon)",
    "Thuja occidentalis (Thuya)", "Thymus vulgaris (Thym)", "Tilia cordata (Tilleul à petites feuilles)", "Tilia platyphyllos", "Trachelospermum jasminoides", "Tsuga canadensis", "Tsuga heterophylla", "Ulmus glabra", "Ulmus minor (Orme champêtre)", "Ulmus parvifolia (Orme de Chine)", "Ulmus procera", "Ulmus pumila (Orme de Sibérie)", "Viburnum opulus", "Wisteria floribunda (Glycine)", "Wisteria sinensis",
    "Zanthoxylum piperitum (Poivrier du Japon)", "Zelkova carpinifolia", "Zelkova nire", "Zelkova serrata (Orme du Japon)"
];

// --- GESTION INDEXEDDB (Base de données) ---
let db;
const DB_NAME = "NiwaDB";
const DB_VERSION = 1;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (event) => console.error("Erreur DB", event);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('bonsais')) {
                db.createObjectStore('bonsais', { keyPath: 'id', autoIncrement: true });
            }
        };
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("DB Ouverte avec succès");
            loadList();
            populateDatalist(); // On charge la liste géante ici
            resolve(db);
        };
    });
}

// Fonction pour remplir la datalist
function populateDatalist() {
    const dataList = document.getElementById('speciesList');
    dataList.innerHTML = '';
    ALL_SPECIES.forEach(species => {
        const option = document.createElement('option');
        option.value = species;
        dataList.appendChild(option);
    });
}

// Variables globales
let currentImageBase64 = null;
let currentEditingId = null;

// --- OUVERTURE / FERMETURE MODALE ---

function openCreateModal() {
    // Mode CRÉATION
    currentEditingId = null;
    currentImageBase64 = null;
    
    document.getElementById('detailNameInput').value = '';
    document.getElementById('detailSpeciesInput').value = '';
    document.getElementById('detailDateInput').value = '';
    document.getElementById('notesArea').value = '';
    
    document.getElementById('detailImageDisplay').src = '';
    document.getElementById('detailImageDisplay').style.display = 'none';
    document.getElementById('imageUpload').value = '';

    document.getElementById('btnSaveNew').style.display = 'block'; 
    document.getElementById('editModeSections').style.display = 'none'; 
    
    document.getElementById('detailModal').style.display = 'flex';
}

function openEditModal(bonsai) {
    // Mode ÉDITION
    currentEditingId = bonsai.id;
    currentImageBase64 = bonsai.image;

    document.getElementById('detailNameInput').value = bonsai.name;
    document.getElementById('detailSpeciesInput').value = bonsai.species;
    document.getElementById('detailDateInput').value = bonsai.purchaseDate;
    document.getElementById('notesArea').value = bonsai.notes;

    if (bonsai.image) {
        document.getElementById('detailImageDisplay').src = bonsai.image;
        document.getElementById('detailImageDisplay').style.display = 'block';
    } else {
        document.getElementById('detailImageDisplay').style.display = 'none';
    }

    document.getElementById('btnSaveNew').style.display = 'none'; 
    document.getElementById('editModeSections').style.display = 'block'; 

    renderHistory(bonsai.history);
    renderFuture(bonsai.futurePlan);
    fillSelects();

    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// --- GESTION IMAGE ---
function handleImagePreview(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageBase64 = e.target.result; 
            const img = document.getElementById('detailImageDisplay');
            img.src = currentImageBase64;
            img.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// --- CRUD ---

function saveNewBonsai() {
    const name = document.getElementById('detailNameInput').value;
    if (!name) return alert("Le nom est obligatoire");

    const newBonsai = {
        name: name,
        species: document.getElementById('detailSpeciesInput').value,
        purchaseDate: document.getElementById('detailDateInput').value,
        image: currentImageBase64,
        notes: document.getElementById('notesArea').value,
        history: [],
        futurePlan: []
    };

    const transaction = db.transaction(['bonsais'], 'readwrite');
    const store = transaction.objectStore('bonsais');
    store.add(newBonsai);

    transaction.oncomplete = () => {
        closeModal();
        loadList();
    };
}

function updateCurrentBonsai() {
    if (!currentEditingId) return;

    const transaction = db.transaction(['bonsais'], 'readwrite');
    const store = transaction.objectStore('bonsais');
    const request = store.get(currentEditingId);

    request.onsuccess = () => {
        const data = request.result;
        data.name = document.getElementById('detailNameInput').value;
        data.species = document.getElementById('detailSpeciesInput').value;
        data.purchaseDate = document.getElementById('detailDateInput').value;
        data.notes = document.getElementById('notesArea').value;
        data.image = currentImageBase64; 
        
        store.put(data);
        closeModal();
        loadList();
    };
}

function loadList() {
    const list = document.getElementById('bonsaiList');
    list.innerHTML = '';
    
    const transaction = db.transaction(['bonsais'], 'readonly');
    const store = transaction.objectStore('bonsais');
    const request = store.getAll();

    request.onsuccess = () => {
        const bonsais = request.result;
        
        if (bonsais.length === 0) {
            document.getElementById('emptyMessage').style.display = 'block';
        } else {
            document.getElementById('emptyMessage').style.display = 'none';
            bonsais.reverse().forEach(bonsai => {
                createCard(bonsai, list);
            });
        }
    };
}

function createCard(bonsai, container) {
    const div = document.createElement('div');
    div.className = 'card';
    
    const imgHTML = bonsai.image 
        ? `<img src="${bonsai.image}" class="bonsai-thumbnail">` 
        : `<div class="bonsai-thumbnail placeholder"><i class="fas fa-seedling"></i></div>`;

    let lastAction = "Pas d'intervention";
    if (bonsai.history && bonsai.history.length > 0) {
        const last = bonsai.history[bonsai.history.length - 1];
        lastAction = `${last.type} (${new Date(last.date).toLocaleDateString('fr-FR')})`;
    }

    div.innerHTML = `
        ${imgHTML}
        <div class="card-text">
            <h3>${bonsai.name}</h3>
            <span class="species">${bonsai.species || 'Inconnu'}</span>
            <p class="history-preview">${lastAction}</p>
        </div>
        <div class="card-actions">
            <button onclick="deleteBonsai(${bonsai.id})" class="btn-delete-icon"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    div.addEventListener('click', (e) => {
        if(!e.target.closest('.btn-delete-icon')) {
            openEditModal(bonsai);
        }
    });

    container.appendChild(div);
}

function deleteBonsai(id) {
    if(confirm("Supprimer cet arbre définitivement ?")) {
        const transaction = db.transaction(['bonsais'], 'readwrite');
        transaction.objectStore('bonsais').delete(id);
        transaction.oncomplete = () => loadList();
    }
}

function resetDatabase() {
    if(confirm("ATTENTION : CELA VA TOUT EFFACER !")) {
        const req = indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = () => window.location.reload();
    }
}

// --- GESTION ACTIONS ---

function fillSelects() {
    const pastSelect = document.getElementById('pastActionSelect');
    const futureSelect = document.getElementById('futureActionSelect');
    pastSelect.innerHTML = '';
    futureSelect.innerHTML = '';

    for (const [key, val] of Object.entries(ACTION_TYPES)) {
        pastSelect.innerHTML += `<option value="${val}">${val}</option>`;
    }
    for (const [key, val] of Object.entries(FUTURE_ACTIONS)) {
        futureSelect.innerHTML += `<option value="${val}">${val}</option>`;
    }
}

function addHistoryAction() {
    if (!currentEditingId) return;
    const type = document.getElementById('pastActionSelect').value;
    const date = new Date().toISOString().split('T')[0];

    const transaction = db.transaction(['bonsais'], 'readwrite');
    const store = transaction.objectStore('bonsais');
    
    store.get(currentEditingId).onsuccess = (e) => {
        const data = e.target.result;
        if (!data.history) data.history = [];
        data.history.push({ type, date });
        store.put(data);
        renderHistory(data.history);
    };
}

function addFutureAction() {
    if (!currentEditingId) return;
    const type = document.getElementById('futureActionSelect').value;
    const date = document.getElementById('futureDateInput').value;
    if (!date) return alert("Date requise");

    const transaction = db.transaction(['bonsais'], 'readwrite');
    const store = transaction.objectStore('bonsais');
    
    store.get(currentEditingId).onsuccess = (e) => {
        const data = e.target.result;
        if (!data.futurePlan) data.futurePlan = [];
        data.futurePlan.push({ type, date });
        store.put(data);
        renderFuture(data.futurePlan);
    };
}

function renderHistory(history) {
    const container = document.getElementById('historyList');
    container.innerHTML = '';
    if (!history || history.length === 0) return;

    history.sort((a,b) => new Date(b.date) - new Date(a.date)).forEach(h => {
        container.innerHTML += `
            <div class="action-row">
                <span class="action-label">${h.type}</span>
                <span class="action-date">${new Date(h.date).toLocaleDateString('fr-FR')}</span>
            </div>
        `;
    });
}

function renderFuture(plan) {
    const container = document.getElementById('futureList');
    container.innerHTML = '';
    if (!plan || plan.length === 0) return;

    plan.sort((a,b) => new Date(a.date) - new Date(b.date)).forEach((p, index) => {
        container.innerHTML += `
            <div class="action-row">
                <span class="action-label">${p.type}</span>
                <span class="action-date">${new Date(p.date).toLocaleDateString('fr-FR')}</span>
                <i class="fas fa-times" style="color:red; cursor:pointer;" onclick="removeFuture(${index})"></i>
            </div>
        `;
    });
}

function removeFuture(index) {
     const transaction = db.transaction(['bonsais'], 'readwrite');
     const store = transaction.objectStore('bonsais');
     store.get(currentEditingId).onsuccess = (e) => {
         const data = e.target.result;
         data.futurePlan.splice(index, 1);
         store.put(data);
         renderFuture(data.futurePlan);
     };
}

initDB();
