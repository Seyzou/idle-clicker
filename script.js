function logEvent(event) {
    console.log(`[${new Date().toLocaleString()}] ${event}`);
}

document.addEventListener("DOMContentLoaded", function () {
    let data = JSON.parse(localStorage.getItem('idleGameData')) || {
        money: 0,
        productionPerClick: 1,
        upgrades: [
            { name: "Upgrade 1", productionIncrease: 1, baseCost: 100, costMultiplier: 1.2, owned: 0, cost: 100 },
            { name: "Upgrade 2", productionIncrease: 2, baseCost: 300, costMultiplier: 1.5, owned: 0, cost: 300 },
            // Ajoutez d'autres niveaux d'amélioration au besoin
        ],
        miners: [
            { name: "Miner 1", productionPerMinute: 2, baseCost: 1000, costMultiplier: 1.5, owned: 0, cost: 1000 },
            { name: "Miner 2", productionPerMinute: 5, baseCost: 5000, costMultiplier: 2.5, owned: 0, cost: 5000 },
            // Ajoutez d'autres mineurs au besoin
        ],
        minerInterval: 1000, // 1 minute en millisecondes
        minerProduction: 0, // Production totale de tous les mineurs
        minerEnabled: false,

    };
    let upgradeButtonsVisible = false; // Variable pour suivre l'état d'affichage des boutons
    let upgradeMinersVisible = false;
    let dataStats = JSON.parse(localStorage.getItem('idleGameStats')) || {
        playerClic: 0,
        playerProduced: 0,
        minersProduced: 0,
        clickCount: 0,
        bestClickCount: 0
    };
    const stats = document.getElementById('stats');
    const DevStats = document.getElementById('DevStats');

    updateStats();
    dataStats.clickCount = 0;
    const moneyDisplay = document.getElementById('moneyDisplay');
    const productionPerClickDisplay = document.getElementById('productionPerClickDisplay');
    const minerProductionDisplay = document.getElementById('minerProductionDisplay');
    const strikeDiplay = document.getElementById('strikeDisplay');
    const bestStrikeDiplay = document.getElementById('bestStrikeDisplay');

    const upgradeOptionsDiv = document.getElementById('upgradeOptions');
    const minerOptionsDiv = document.getElementById('minerOptions');
    startMining();
    function updateStatsDisplay() {
        moneyDisplay.textContent = `$${data.money.toFixed(2)}`;
        productionPerClickDisplay.textContent = `$${data.productionPerClick}/clics`;
        minerProductionDisplay.textContent = `Mineurs: $${data.minerProduction}/sec`;
        bestStrikeDiplay.textContent = `Meilleur strike ${dataStats.bestClickCount} 🔥`;

        strikeDiplay.textContent = `🔥 ${dataStats.clickCount} 🔥`;
    }

    function updateStats() {
        stats.textContent = JSON.stringify(dataStats, null, 2);
        DevStats.textContent = JSON.stringify(data, null, 2);
    }

    function saveDataToLocal() {
        localStorage.setItem('idleGameData', JSON.stringify(data));
        localStorage.setItem('idleGameStats', JSON.stringify(dataStats));
        updateStatsDisplay();
        updateStats();

    }

    function createUpgradeButton(upgrade) {
        const buttonContainer = document.createElement('div');
        const button = document.createElement('button');
        button.textContent = `${upgrade.name} - Cost: $${(upgrade.cost)}`;

        const upgradeInfo = document.createElement('p');
        upgradeInfo.textContent = `Increase Production by ${upgrade.productionIncrease} Owned: ${upgrade.owned}`;
        upgradeInfo.style.display = 'block'; // Cachez les informations initialement
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(upgradeInfo);

        button.addEventListener('click', function () {
            if (data.money >= upgrade.cost) {
                data.money -= upgrade.cost;
                upgrade.owned++;
                upgrade.cost = (upgrade.owned ? upgrade.baseCost * (upgrade.costMultiplier * upgrade.owned) : upgrade.baseCost).toFixed(2);
                data.productionPerClick += upgrade.productionIncrease;
                saveDataToLocal();
                button.textContent = `${upgrade.name} - Cost: $${(upgrade.cost)}`;
                upgradeInfo.textContent = `Increase Production by ${upgrade.productionIncrease} \n Owned: ${upgrade.owned}`;
                logEvent('Player bought a upgrade');
            }
        });

        return buttonContainer;
    }

    function createMinerButton(miner) {
        const buttonContainer = document.createElement('div');
        const button = document.createElement('button');
        button.textContent = `${miner.name} - Cost: $${miner.cost}`;

        const minerInfos = document.createElement('p');
        minerInfos.textContent = `Produce $${miner.productionPerMinute}/min \n Owned: ${miner.owned}`;
        minerInfos.style.display = 'block'; // Cachez les informations initialement
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(minerInfos);

        button.addEventListener('click', function () {
            if (data.money >= miner.cost) {
                data.money -= miner.cost;
                miner.owned++;
                miner.cost = (miner.owned ? miner.baseCost * (miner.costMultiplier * miner.owned) : miner.baseCost).toFixed(2);
                data.minerEnabled = true;
                saveDataToLocal();
                if (!data.minerEnabled) startMining();
                button.textContent = `${miner.name} - Cost: $${miner.cost}`;
                minerInfos.textContent = `Produce $${miner.productionPerMinute} \n Owned: ${miner.owned}`;
                logEvent('Player bought a miner');
            }
        });
        return buttonContainer;
    }

    function updateUpgradeOptions() {
        upgradeOptionsDiv.innerHTML = '';
        data.upgrades.forEach(function (upgrade) {
            const button = createUpgradeButton(upgrade);
            upgradeOptionsDiv.appendChild(button);
        });
    }

    function updateMinerOptions() {
        minerOptionsDiv.innerHTML = '';
        data.miners.forEach(function (miner) {
            const button = createMinerButton(miner);
            minerOptionsDiv.appendChild(button);
        });
    }

    function calculateMinerProduction() {
        data.minerProduction = data.miners.reduce((totalProduction, miner) => {
            return totalProduction + (miner.productionPerMinute * miner.owned);
        }, 0);
    }

    function startMining() {
        if (data.minerEnabled) {
            setInterval(function () {
                if (!data.minerEnabled) return;
                calculateMinerProduction();
                updateStatsDisplay()
                data.money += data.minerProduction;
                saveDataToLocal();
                dataStats.minersProduced += data.minerProduction;
                logEvent('Money produced by miners');
            }, data.minerInterval);
        } else {
            clearInterval()
        }
    }

    const clickButton = document.getElementById('clickButton');
    const buyUpgradeButton = document.getElementById('buyUpgrade');
    const buyMinerButton = document.getElementById('buyMiner');
    let clickTimeout; // Variable pour stocker le timeout

    clickButton.addEventListener('click', function () {
        data.money += data.productionPerClick;
        dataStats.playerClic++;
        dataStats.playerProduced = dataStats.playerProduced + data.productionPerClick;
        saveDataToLocal();
        logEvent('Player clicked to earn money');
    });

    clickButton.addEventListener('mousedown', function () {
        dataStats.clickCount++; // Incrémenter le nombre de clics lorsque le bouton est enfoncé
        if (dataStats.bestClickCount < dataStats.clickCount) {
            dataStats.bestClickCount = dataStats.clickCount;
        }
        updateButtonColor(); // Mettre à jour la couleur du bouton
        clearTimeout(clickTimeout); // Réinitialiser le timeout lorsque le bouton est enfoncé
    });

    clickButton.addEventListener('mouseup', function () {
        // Définir un timeout pour réinitialiser clickCount après 5 secondes
        clickTimeout = setTimeout(async function () {
            dataStats.clickCount = 0; // Réinitialiser le nombre de clics après 5 secondes
            strikeDiplay.style.display = "none";

            await saveDataToLocal();
            updateButtonColor(); // Mettre à jour la couleur du bouton
        }, 2000); // 2000 millisecondes (2 secondes)
    });

    async function updateButtonColor() {
        if (dataStats.clickCount >= 100) {
            clickButton.classList.remove('red');
            clickButton.classList.add("flames")
        } else if (dataStats.clickCount >= 50) {
            clickButton.classList.remove('orange');
            clickButton.classList.add("red")
        } else if (dataStats.clickCount >= 25) {
            clickButton.classList.remove('yellow');
            clickButton.classList.add("orange")
        } else if (dataStats.clickCount >= 10) { // Si le nombre de clics est supérieur ou égal à 5
            strikeDiplay.style.display = "block";

            clickButton.classList.add("yellow")
        } else {
            clickButton.classList.remove("flames")
            clickButton.classList.remove('orange');
            clickButton.classList.remove('yellow');
            clickButton.classList.remove('red'); // Retirer la classe 'red' pour revenir à la couleur initiale du bouton
        }
    }


    buyUpgradeButton.addEventListener('click', function () {
        if (!upgradeButtonsVisible) {
            upgradeOptionsDiv.innerHTML = ''; // Effacez le contenu précédent
            updateUpgradeOptions()
            upgradeButtonsVisible = true; // Mettez à jour l'état des boutons comme visibles
        } else {
            upgradeOptionsDiv.innerHTML = ''; // Effacez le contenu
            upgradeButtonsVisible = false; // Mettez à jour l'état des boutons comme masqués
        }

    });

    buyMinerButton.addEventListener('click', function () {
        if (!upgradeMinersVisible) {
            minerOptionsDiv.innerHTML = ''; // Effacez le contenu précédent
            updateMinerOptions();
            upgradeMinersVisible = true; // Mettez à jour l'état des boutons comme visibles
        } else {
            minerOptionsDiv.innerHTML = ''; // Effacez le contenu
            upgradeMinersVisible = false; // Mettez à jour l'état des boutons comme masqués
        }


    });

    updateStatsDisplay();





    // DEV PARTS
    const toggleMiningButton = document.getElementById('toggleMining');
    const resetProdButton = document.getElementById('resetProd');
    const produceDevButton = document.getElementById('produce1m');

    toggleMiningButton.addEventListener('click', function () {
        if (!data.minerEnabled) {
            toggleMiningButton.textContent = 'Toggle Mining (True)';
            data.minerEnabled = true; // Mettez à jour l'état des boutons comme visibles
            startMining();
        } else {
            toggleMiningButton.textContent = 'Toggle Mining (False)';
            data.minerEnabled = false; // Mettez à jour l'état des boutons comme visibles
        }
    });


    produceDevButton.addEventListener('click', function () {
        data.money += 100000;
        dataStats.playerClic++;
        dataStats.playerProduced = dataStats.playerProduced + data.productionPerClick;
        saveDataToLocal();
        logEvent('Player clicked to earn money 10000');
    });
});
