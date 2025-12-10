// ... (Toutes les fonctions renderBonsais, previewImage, readImageAsBase64... sont inchangées)

// NOUVELLE FONCTION pour ouvrir/fermer le formulaire
function toggleAddForm(show) {
    const overlay = document.getElementById('addFormOverlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
        // Réinitialiser les champs au moment de la fermeture
        document.getElementById('nameInput').value = '';
        document.getElementById('speciesInput').value = '';
        document.getElementById('photoInput').value = null; 
        document.getElementById('imagePreview').style.display = 'none';
    }
}


// MODIFICATION DANS addBonsai
function addBonsai() {
    const nameInput = document.getElementById('nameInput');
    const speciesInput = document.getElementById('speciesInput');
    const fileInput = document.getElementById('photoInput');
    const addButton = document.querySelector('.btn-primary');

    if (!nameInput.value) {
        alert("Il faut donner un nom à l'arbre !");
        return;
    }
    
    // ... (Reste du code de addBonsai)
    
    // NOUVEAU: Mettre à jour la fonction saveAndReset pour fermer l'overlay
    function saveAndReset() {
        saveData();
        renderBonsais();
        
        // Réinitialisation du formulaire (la fonction toggleAddForm(false) s'en chargera)
        toggleAddForm(false); // FERME L'OVERLAY APRES SUCCÈS
        
        addButton.disabled = false;
        addButton.textContent = 'Ajouter au jardin';
    }
    
    // ... (Le reste de la fonction addBonsai, y compris la gestion de la lecture de fichier, reste le même)
    
    // 1. Désactiver le bouton et gérer la lecture de fichier (Copiez le reste de la fonction addBonsai ici)
    if (fileInput.files && fileInput.files[0]) {
        // ... (Code asynchrone pour la photo)
        
        // Collez le corps de la fonction addBonsai précédente ICI
        // **********************************************
        addButton.disabled = true;
        addButton.textContent = 'Chargement photo...';

        const reader = new FileReader();

        reader.onload = function(e) {
            newBonsai.photoBase64 = e.target.result;
            bonsais.unshift(newBonsai); // Ajout de la fiche
            saveAndReset();
        };

        reader.onerror = function() {
            alert("Erreur lors de la lecture de la photo. Ajout sans photo.");
            bonsais.unshift(newBonsai); // Ajout sans photo
            saveAndReset();
        }

        reader.readAsDataURL(fileInput.files[0]);
        
    } else {
        // Pas de photo, ajout direct
        bonsais.unshift(newBonsai);
        saveAndReset();
    }
}
// ... (Le reste des fonctions performAction, deleteBonsai, resetData, saveData restent inchangées)
