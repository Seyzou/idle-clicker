

// document.addEventListener("DOMContentLoaded", function () {
//     let data = JSON.parse(localStorage.getItem('idleGameData')) || {
//         miners: [
//             { name: "Miner 1", productionPerMinute: 20, baseCost: 100, costMultiplier: 2, owned: 10 },
//             { name: "Miner 2", productionPerMinute: 2, baseCost: 200, costMultiplier: 2.5, owned: 0 },
//         ],
//         money: 0,
//         productionPerClick: 1,
//         upgradeCost: 10,
//         upgradeMultiplier: 2,
//         minerInterval: 10000, // 1 minute en millisecondes
//         minerEnabled: false,
//         minerProduction: 0 // Production totale de tous les mineurs
//     };

//     let dataStats = JSON.parse(localStorage.getItem('idleGameStats')) || {
//         playerClic: 0,
//         playerProduced: 0,
//         minersProduced: 0,
//     }

//     const moneyDisplay = document.getElementById('moneyDisplay');
//     const clickButton = document.getElementById('clickButton');
//     const buyUpgradeButton = document.getElementById('buyUpgrade');
//     const buyMinerButton = document.getElementById('buyMiner');
//     const stats = document.getElementById('stats');
//     updateStats();
//     function saveDataToLocal() {
//         localStorage.setItem('idleGameData', JSON.stringify(data));
//         localStorage.setItem('idleGameStats', JSON.stringify(dataStats));
//     }

//     function updateMoneyDisplay() {
//         moneyDisplay.textContent = `Argent: $${data.money}`;
//         buyUpgradeButton.textContent = `[${data.productionPerClick}] Production x2 ($${data.upgradeCost})`;
//         buyMinerButton.textContent = `[${data.miners[0].owned}] ${data.miners[0].name} ($${data.miners[0].baseCost * (data.miners[0].owned + 1) * data.miners[0].costMultiplier})`;
//     }

//     function updateStats() {
//         stats.textContent = JSON.stringify(data, null, 2);
//     }

//     clickButton.addEventListener('click', function () {
//         data.money += data.productionPerClick;
//         dataStats.playerClic++;
//         dataStats.playerProduced = dataStats.playerProduced + data.productionPerClick;
//         updateMoneyDisplay();
//         updateStats();
//         saveDataToLocal();
//         logEvent('Player clicked to earn money');

//     });

//     buyUpgradeButton.addEventListener('click', function () {
//         if (data.money >= data.upgradeCost) {
//             data.money -= data.upgradeCost;
//             data.productionPerClick += 1;
//             data.upgradeCost *= data.upgradeMultiplier;
//             updateMoneyDisplay();
//             updateStats();
//             saveDataToLocal();
//             logEvent('Player bought an upgrade');
//         }
//     });

//     buyMinerButton.addEventListener('click', function () {
//         if (data.money >= data.miners[0].baseCost * (data.miners[0].owned + 1) * data.miners[0].costMultiplier) {
//             data.money -= data.miners[0].baseCost * (data.miners[0].owned + 1) * data.miners[0].costMultiplier;
//             data.miners[0].owned += 1;
//             data.minerEnabled = true;
//             updateMoneyDisplay();
//             updateStats();
//             saveDataToLocal();
//             logEvent('Player bought a miner');

//         }
//     });

//     if (data.miners[0].owned + data.miners[1].owned >= 1 || data.minerEnabled) {
//         setInterval(produceMoney, data.minerInterval); // Commencer la production automatique si c'est le premier mineur acheté
//         data.minerEnabled = true;
//     }

//     function produceMoney() {
//         data.money += (data.miners[0].productionPerMinute * data.miners[0].owned + data.miners[1].productionPerMinute * data.miners[1].owned);
//         dataStats.minersProduced += (data.miners[0].productionPerMinute * data.miners[0].owned) + (data.miners[1].productionPerMinute * data.miners[1].owned);
//         updateMoneyDisplay();
//         updateStats();
//         saveDataToLocal();
//         logEvent('Money produced by miners');


//     }


//     // Charger les données depuis le localStorage lors du chargement de la page
//     updateMoneyDisplay();
// });
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
        minerInterval: 60000, // 1 minute en millisecondes
        minerProduction: 0, // Production totale de tous les mineurs
        minerEnabled: false,

    };

    let dataStats = JSON.parse(localStorage.getItem('idleGameStats')) || {
        playerClic: 0,
        playerProduced: 0,
        minersProduced: 0,
    };
    const stats = document.getElementById('stats');
    updateStats();

    const moneyDisplay = document.getElementById('moneyDisplay');
    const productionPerClickDisplay = document.getElementById('productionPerClickDisplay');
    const minerProductionDisplay = document.getElementById('minerProductionDisplay');
    const upgradeOptionsDiv = document.getElementById('upgradeOptions');
    const minerOptionsDiv = document.getElementById('minerOptions');
    startMining();
    function updateStatsDisplay() {
        moneyDisplay.textContent = `Money: $${data.money.toFixed(2)}`;
        productionPerClickDisplay.textContent = `Production Per Click: ${data.productionPerClick}`;
        minerProductionDisplay.textContent = `Miner Production: $${data.minerProduction} per minute`;
    }

    function updateStats() {
        stats.textContent = JSON.stringify(dataStats, null, 2);
    }

    function saveDataToLocal() {
        localStorage.setItem('idleGameData', JSON.stringify(data));
        localStorage.setItem('idleGameStats', JSON.stringify(dataStats));
        updateStatsDisplay();
        updateStats();
    }

    function createUpgradeButton(upgrade) {
        const button = document.createElement('button');
        button.textContent = `${upgrade.name} - Cost: $${(upgrade.cost)}`;
        button.addEventListener('click', function () {
            if (data.money >= upgrade.cost) {
                data.money -= upgrade.cost;
                upgrade.owned++;
                upgrade.cost = (upgrade.owned ? upgrade.baseCost * (upgrade.costMultiplier * upgrade.owned) : upgrade.baseCost).toFixed(2);
                data.productionPerClick += upgrade.productionIncrease;
                saveDataToLocal();
                button.textContent = `${upgrade.name} - Cost: $${upgrade.cost}`;
                logEvent('Player bought a upgrade');
            }
        });
        return button;
    }

    function createMinerButton(miner) {
        const button = document.createElement('button');
        button.textContent = `${miner.name} - Cost: $${miner.cost}`;
        button.addEventListener('click', function () {
            if (data.money >= miner.cost) {
                data.money -= miner.cost;
                miner.owned++;
                miner.cost = (miner.owned ? miner.baseCost * (miner.costMultiplier * miner.owned) : miner.baseCost).toFixed(2);
                data.minerEnabled = true;
                saveDataToLocal();
                startMining(); // Démarre la production automatique si nécessaire
                button.textContent = `${miner.name} - Cost: $${miner.cost}`;
                logEvent('Player bought a miner');
            }
        });
        return button;
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
                calculateMinerProduction();
                updateStatsDisplay()
                data.money += data.minerProduction;
                saveDataToLocal();
                dataStats.minersProduced += data.minerProduction;
                logEvent('Money produced by miners');
            }, data.minerInterval);
        }
    }

    const clickButton = document.getElementById('clickButton');
    const buyUpgradeButton = document.getElementById('buyUpgrade');
    const buyMinerButton = document.getElementById('buyMiner');

    clickButton.addEventListener('click', function () {
        data.money += data.productionPerClick;
        dataStats.playerClic++;
        dataStats.playerProduced = dataStats.playerProduced + data.productionPerClick;
        saveDataToLocal();
        logEvent('Player clicked to earn money');
    });

    buyUpgradeButton.addEventListener('click', function () {
        updateUpgradeOptions();

    });

    buyMinerButton.addEventListener('click', function () {
        updateMinerOptions();
    });

    updateStatsDisplay();
});
