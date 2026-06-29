// app.js

// --- BASE DE DONNÉES DES SCÉNARIOS ---
const SCENARIOS = {
    winwin: {
        title: "Le Win-Win Naturel (Coordination)",
        options: {
            couple: {
                label: "Le Couple et la Soirée",
                text: "Un couple cherche à s'accorder sur sa soirée. L'idéal est de faire une activité ensemble plutôt que chacun dans son coin.",
                moves: ["Danser", "Candy Crush"],
                matrix: [
                    ["+2 / +2", "-2 / -2"],
                    ["-2 / -2", "-1 / -1"]
                ],
                takeaway: "Équilibre de Nash convergent. Quand les intérêts sont alignés, la négociation n'est qu'un problème de communication. Le Win-Win est facile."
            },
            ecologie: {
                label: "Sauvetage du Lac Écologique",
                text: "Un lac partagé menace de déborder d'algues vertes toxiques. Les deux communes doivent installer un système de filtrage global simultanément.",
                moves: ["Investir", "Ne rien faire"],
                matrix: [
                    ["+2 / +2", "-2 / -1"],
                    ["-1 / -2", "-1 / -1"]
                ],
                takeaway: "Si une seule commune investit, l'argent est perdu car les algues passent par l'autre côté. Sans coordination, le désastre est total."
            }
        }
    },
    sexes: {
        title: "La Guerre des Sexes (Guerre de Positions)",
        options: {
            logistique: {
                label: "Logistique des conteneurs",
                text: "Deux entreprises doivent expédier leurs marchandises dans un conteneur partagé. L'une préfère le Train (écolo), l'autre le Camion (rapide).",
                moves: ["Train", "Camion"],
                matrix: [
                    ["+2 / 0", "-1 / -1"],
                    ["-1 / -1", "0 / +2"]
                ],
                takeaway: "Avantage au premier qui parle. Il y a deux équilibres asymétriques. Pour imposer sa solution, il faut ancrer sa position immédiatement."
            },
            profs: {
                label: "Le projet Grand Oral",
                text: "Deux enseignants (Histoire et Philo) veulent co-animer un cours. Cela demande de fusionner les créneaux et de partager le temps de parole.",
                moves: ["Coordonner", "Solo"],
                matrix: [
                    ["+2 / +2", "-1 / -1"],
                    ["-1 / -1", "+1 / -1"]
                ],
                takeaway: "Si les deux y vont sans s'être mis d'accord, le conflit éclate devant les élèves. S'accorder crée de la valeur, mais demande un effort partagé."
            }
        }
    },
    dilemme: {
        title: "Le Dilemme du Prisonnier (Le Piège)",
        options: {
            valentin: {
                label: "Le Piège de la Saint-Valentin",
                text: "Devez-vous offrir un cadeau ce soir ? Si vous offrez et pas l'autre, vous passez pour un dupe. Si personne n'offre, la soirée est neutre.",
                moves: ["Offrir", "Pas offrir"],
                matrix: [
                    ["+1 / +1", "-2 / +2"],
                    ["+2 / -2", "0 / 0"]
                ],
                takeaway: "La rationalité individuelle détruit la valeur globale. La peur d'être le dupe (-2) ou l'envie de gagner gros (+2) pousse à la défection mutuelle (0/0)."
            },
            communs: {
                label: "La Tragédie des Communs (Irrigation)",
                text: "Deux agriculteurs partagent une rivière en été. Faut-il restreindre son irrigation ou pomper au maximum la nuit en cachette ?",
                moves: ["Restreindre", "Pomper"],
                matrix: [
                    ["+1 / +1", "-2 / +2"],
                    ["+2 / -2", "0 / 0"]
                ],
                takeaway: "Le tricheur s'en sort à court terme, mais si tout le monde triche, la rivière s'assèche et toutes les récoltes meurent."
            },
            menage: {
                label: "Le Ménage de l'Appartement",
                text: "Ranger l'appartement fatigue. Si un seul nettoie pendant que l'autre joue à la console dans une maison propre, le gain est asymétrique.",
                moves: ["Ranger", "Laisser traîner"],
                matrix: [
                    ["+1 / +1", "-2 / +2"],
                    ["+2 / -2", "0 / 0"]
                ],
                takeaway: "Le tricheur obtient le beurre, l'argent du beurre et le loisir, tandis que le dupe accumule de la rancœur."
            }
        }
    }
};

const CHICKEN_SCENARIOS = {
    domestique: {
        text: "Le couple se bat pour le programme télé (WoW vs Desperate Housewives). L'un désinstalle le jeu pour forcer l'autre à céder.",
        matrix: [["-1 / -1", "+2 / -2"], ["-2 / +2", "-2 / -2"]],
        takeaway: "Le crash (-2/-2) correspond à la rupture. Gagner demande un engagement unilatéral visible et irréversible pour forcer l'autre à reculer."
    },
    ecologie: {
        text: "Un État menace de fermer une usine polluante. L'industriel réplique en menaçant de licencier 3000 salariés et de délocaliser.",
        matrix: [["-1 / -1", "+2 / -2"], ["-2 / +2", "-2 / -2"]],
        takeaway: "Si aucun ne cède, c'est la catastrophe économique et environnementale. C'est le bras de fer politique standard."
    }
};

// --- GESTION DE LA NAVIGATION ---
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.step-section').forEach(s => s.classList.remove('active'));
        
        e.target.classList.add('active');
        document.getElementById(`step-${e.target.dataset.step}`).classList.add('active');
    });
});

// --- LOGIQUE ÉTAPE 1 (QUIZ) ---
document.querySelectorAll('.quiz-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
        const profile = e.target.dataset.profile;
        const feedback = document.getElementById('quiz-feedback');
        feedback.classList.remove('hidden');
        if (profile === 'dur') {
            feedback.innerHTML = "<strong>Profil DUR :</strong> Vous privilégiez l'Objet. Utile pour maximiser les gains à court terme, mais destructeur pour les partenariats longs.";
        } else {
            feedback.innerHTML = "<strong>Profil DOUX :</strong> Vous privilégiez la Relation. Protecteur, mais vous risquez d'être systématiquement exploité par les profils prédateurs.";
        }
    });
});

// --- LOGIQUE ÉTAPE 2 (MATRICES ONE-SHOT) ---
const gameSelector = document.getElementById('game-type-selector');
const scenarioSelector = document.getElementById('scenario-selector');

function updateScenarioOptions() {
    const gameType = gameSelector.value;
    scenarioSelector.innerHTML = "";
    Object.keys(SCENARIOS[gameType].options).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = SCENARIOS[gameType].options[key].label;
        scenarioSelector.appendChild(opt);
    });
    renderMatrix();
}

function renderMatrix() {
    const gameType = gameSelector.value;
    const scenKey = scenarioSelector.value;
    if (!scenKey) return;

    const data = SCENARIOS[gameType].options[scenKey];
    document.getElementById('scenario-text').textContent = data.text;

    const matrixGrid = document.getElementById('game-matrix');
    matrixGrid.innerHTML = `
        <div class="matrix-cell header-cell">Vous \\ Autre</div>
        <div class="matrix-cell header-cell">${data.moves[0]}</div>
        <div class="matrix-cell header-cell">${data.moves[1]}</div>
        <div class="matrix-cell header-cell">${data.moves[0]}</div>
        <div class="matrix-cell" data-row="0" data-col="0" style="color:var(--green-win)">${data.matrix[0][0]}</div>
        <div class="matrix-cell" data-row="0" data-col="1">${data.matrix[0][1]}</div>
        <div class="matrix-cell header-cell">${data.moves[1]}</div>
        <div class="matrix-cell" data-row="1" data-col="0">${data.matrix[1][0]}</div>
        <div class="matrix-cell" data-row="1" data-col="1" style="color:var(--red-loose)">${data.matrix[1][1]}</div>
    `;

    document.querySelectorAll('#game-matrix .matrix-cell:not(.header-cell)').forEach(cell => {
        cell.addEventListener('click', () => {
            const fb = document.getElementById('matrix-feedback');
            fb.classList.remove('hidden');
            fb.innerHTML = `<strong>Analyse Pédagogique :</strong> ${data.takeaway}`;
        });
    });
}

gameSelector.addEventListener('change', updateScenarioOptions);
scenarioSelector.addEventListener('change', renderMatrix);
updateScenarioOptions();

// --- ÉTAPE 3 : JEU RÉPÉTÉ (10 TOURS) ---
let iterTour = 0;
let scorePlayer = 0;
let scoreIA = 0;
let iaHistory = [];

function playIteratedRound(playerMove) {
    if (iterTour >= 10) return;
    
    // IA implémente Copycat (Tit-for-Tat)
    let iaMove = "C"; 
    if (iaHistory.length > 0) {
        iaMove = iaHistory[iaHistory.length - 1]; // Imite le coup précédent du joueur
    }

    let pPoints = 0, iaPoints = 0;
    if (playerMove === "C" && iaMove === "C") { pPoints = 1; iaPoints = 1; }
    else if (playerMove === "D" && iaMove === "D") { pPoints = 0; iaPoints = 0; }
    else if (playerMove === "D" && iaMove === "C") { pPoints = 2; iaPoints = -2; }
    else if (playerMove === "C" && iaMove === "D") { pPoints = -2; iaPoints = 2; }

    scorePlayer += pPoints;
    scoreIA += iaPoints;
    iterTour++;
    iaHistory.push(playerMove);

    document.getElementById('iter-tour').textContent = iterTour;
    document.getElementById('iter-score-player').textContent = scorePlayer;
    document.getElementById('iter-score-ia').textContent = scoreIA;

    const log = document.getElementById('iter-history');
    log.innerHTML += `Tour ${iterTour}: Vous [${playerMove}] - IA [${iaMove}] (Gains: ${pPoints}/${iaPoints})<br>`;
    
    if (iterTour === 10) {
        log.innerHTML += `<strong>Fin du jeu ! Total - Vous: ${scorePlayer} | IA: ${scoreIA}</strong><br><em>Enseignement : L'Ombre du Futur force la coopération. La tricherie ponctuelle (+2) est balayée par la vengeance systématique.</em>`;
    }
}

document.getElementById('btn-iter-c').addEventListener('click', () => playIteratedRound("C"));
document.getElementById('btn-iter-d').addEventListener('click', () => playIteratedRound("D"));

// --- ÉTAPE 4 : SIMULATION DU BRUIT ---
document.getElementById('btn-play-noise').addEventListener('click', () => {
    const log = document.getElementById('noise-history');
    log.innerHTML = "";
    let pScore = 0, iScore = 0;
    let pHistory = ["C"], iHistory = ["C"]; // Donnant-Donnant mutuel initial

    for (let t = 1; t <= 10; t++) {
        let pMove = pHistory[t-1];
        let iMove = iHistory[t-1];

        // Accident au Tour 4
        if (t === 4) {
            pMove = "D"; // Le joueur voulait faire "C", mais le cadeau est perdu par la poste !
        }

        let pp = 0, ip = 0;
        if (pMove === "C" && iMove === "C") { pp = 1; ip = 1; }
        else if (pMove === "D" && iMove === "D") { pp = 0; ip = 0; }
        else if (pMove === "D" && iMove === "C") { pp = 2; ip = -2; }
        else if (pMove === "C" && iMove === "D") { pp = -2; ip = 2; }

        pScore += pp; iScore += ip;
        log.innerHTML += `Tour ${t}: Joueur A [${pMove}${t===4?' (BUG!)':''}] - Joueur B [${iMove}] (Gains: ${pp}/${ip})<br>`;

        // Préparation du coup suivant (imitation réciproque)
        pHistory.push(iMove);
        iHistory.push(pMove);
    }
    
    const tk = document.getElementById('noise-takeaway');
    tk.classList.remove('hidden');
    tk.innerHTML = "<strong>Le Piège du Malentendu :</strong> Remarquez qu'à partir du Tour 4, les deux Copycats s'enferment dans un cycle infini d'agressions alternées. Dans le monde réel, il faut utiliser des stratégies de <strong>Pardon (Copykitten)</strong> pour valider l'intention avant de punir.";
});

// --- ÉTAPE 4.5 : SÉMINAIRES DE BRÈVES EXPÉRIENCES ---
document.getElementById('btn-show-power').addEventListener('click', () => {
    const box = document.getElementById('box-power');
    box.classList.remove('hidden');
    box.innerHTML = "<strong>Analyse de la BATNA :</strong> Gricha détient le pouvoir car sa ressource (cartes noires) est rare, tandis que la vôtre (rouges) surabonde. La valeur ne découle pas de votre effort, mais de la rareté et de la maîtrise des alternatives.";
});

document.querySelectorAll('#ultimatum-controls .sub-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const choice = e.target.dataset.choice;
        const box = document.getElementById('box-justice');
        box.classList.remove('hidden');
        if (choice === 'accept') {
            box.innerHTML = "Vous avez accepté par pur calcul économique (3 € c'est mieux que 0 €).";
        } else {
            box.innerHTML = "Vous avez préféré perdre 3 € pour punir l'injustice de l'IA. <strong>En négociation, le sentiment d'équité est supérieur au gain financier pur.</strong>";
        }
    });
});

let auctionStep = 0;
document.getElementById('btn-auction-step').addEventListener('click', () => {
    const log = document.getElementById('auction-log');
    if (auctionStep === 0) { log.innerHTML = "Élève A mise : 1 €<br>Élève B mise : 2 € (pour gagner le billet)<br>"; auctionStep++; }
    else if (auctionStep === 1) { log.innerHTML += "Élève A mise : 5 € (pour couvrir sa perte)<br>Élève B mise : 8 €<br>"; auctionStep++; }
    else if (auctionStep === 2) { log.innerHTML += "Élève A mise : 10 € (seuil de rentabilité)<br>Élève B mise : 11 € ! (Mise supérieure au gain pour ne pas perdre ses 8 € engagés)<br><strong>Escalade de l'Ego ! Le piège de la perte s'est refermé.</strong>"; auctionStep = 0; }
});

// --- ÉTAPE 5 : CHICKEN GAME ---
const chickenSelect = document.getElementById('chicken-scenario-selector');
function renderChicken() {
    const choice = chickenSelect.value;
    const data = CHICKEN_SCENARIOS[choice] || CHICKEN_SCENARIOS.domestique;
    document.getElementById('chicken-text').textContent = data.text;
    
    const matrix = document.getElementById('chicken-matrix');
    matrix.innerHTML = `
        <div class="matrix-cell header-cell">Moi \\ Autre</div>
        <div class="matrix-cell header-cell">Céder</div>
        <div class="matrix-cell header-cell">S'imposer</div>
        <div class="matrix-cell header-cell">Céder</div>
        <div class="matrix-cell">-1 / -1</div>
        <div class="matrix-cell" style="color:var(--green-win)">-2 / +2</div>
        <div class="matrix-cell header-cell">S'imposer</div>
        <div class="matrix-cell" style="color:var(--green-win)">+2 / -2</div>
        <div class="matrix-cell" style="color:var(--red-loose)">-2 / -2 (Crash)</div>
    `;
    
    const fb = document.getElementById('chicken-feedback');
    fb.classList.remove('hidden');
    fb.innerHTML = `<strong>Enseignement :</strong> ${data.takeaway}`;
}
chickenSelect.addEventListener('change', renderChicken);
renderChicken();