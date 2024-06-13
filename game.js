document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    const upgradeSpeedButton = document.getElementById('upgrade-speed');
    const upgradeMultiplierButton = document.getElementById('upgrade-multiplier');
    const saveButton = document.getElementById('save-button');
    const loadButton = document.getElementById('load-button');

    let playerX = gameContainer.clientWidth / 2 - player.clientWidth / 2;
    let playerY = gameContainer.clientHeight / 2 - player.clientHeight / 2;
    let speed = 5;
    let score = 0;
    let speedUpgradeCost = 10;
    let multiplierUpgradeCost = 20;
    let speedMultiplier = 1;
    let scoreMultiplier = 1;

    // Define block properties
    const blockTypes = ['yellow', 'red'];
    let blocks = [];

    function createBlock(type) {
        const block = document.createElement('div');
        block.classList.add('block', type + '-block');
        block.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
        block.style.top = Math.random() * (gameContainer.clientHeight - 30) + 'px';
        gameContainer.appendChild(block);
        blocks.push({ element: block, type: type });
        console.log(`${type} block created at (${block.style.left}, ${block.style.top})`);
    }

    function updatePlayerPosition() {
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }

    function movePlayer(event) {
        switch (event.key) {
            case 'ArrowUp':
                playerY = Math.max(0, playerY - speed);
                break;
            case 'ArrowDown':
                playerY = Math.min(gameContainer.clientHeight - player.clientHeight, playerY + speed);
                break;
            case 'ArrowLeft':
                playerX = Math.max(0, playerX - speed);
                break;
            case 'ArrowRight':
                playerX = Math.min(gameContainer.clientWidth - player.clientWidth, playerX + speed);
                break;
        }
        updatePlayerPosition();
        checkCollisions();
    }

    async function saveGame() {
        const gameState = {
            playerX: playerX,
            playerY: playerY,
            speed: speed,
            score: score,
            speedMultiplier: speedMultiplier,
            scoreMultiplier: scoreMultiplier
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    async function loadGame() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            playerX = gameState.playerX;
            playerY = gameState.playerY;
            speed = gameState.speed;
            score = gameState.score;
            speedMultiplier = gameState.speedMultiplier || 1;
            scoreMultiplier = gameState.scoreMultiplier || 1;
            scoreElement.textContent = score;
            updatePlayerPosition();
            updateBlocks();
        }
    }

    async function buySpeedUpgrade() {
        if (score >= speedUpgradeCost) {
            speed += 2;
            score -= speedUpgradeCost;
            speedUpgradeCost *= 2;
            updateUpgradeButtons();
            updateScore();
        }
    }

    async function buyMultiplierUpgrade() {
        if (score >= multiplierUpgradeCost) {
            speedMultiplier += 0.5;
            scoreMultiplier += 1;
            score -= multiplierUpgradeCost;
            multiplierUpgradeCost *= 2;
            updateUpgradeButtons();
            updateScore();
        }
    }

    function checkCollisions() {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (isColliding(player, block.element)) {
                if (block.type === 'yellow') {
                    score += 10 * scoreMultiplier;
                    scoreElement.textContent = score;
                    block.element.remove();
                    blocks.splice(i, 1);
                    createBlock('yellow');
                } else if (block.type === 'red') {
                    score -= 5 * scoreMultiplier;
                    scoreElement.textContent = score;
                    block.element.remove();
                    blocks.splice(i, 1);
                    createBlock('red');
                }
            }
        }
    }

    function isColliding(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    function updateUpgradeButtons() {
        upgradeSpeedButton.textContent = `Upgrade Speed (${speedUpgradeCost} Score)`;
        upgradeMultiplierButton.textContent = `Upgrade Multiplier (${multiplierUpgradeCost} Score)`;
    }

    function updateBlocks() {
        blocks.forEach(block => block.element.remove());
        blocks = [];
        for (let i = 0; i < 5; i++) {
            createBlock('yellow');
            createBlock('red');
        }
    }

    document.addEventListener('keydown', movePlayer);
    saveButton.addEventListener('click', saveGame);
    loadButton.addEventListener('click', loadGame);
    upgradeSpeedButton.addEventListener('click', buySpeedUpgrade);
    upgradeMultiplierButton.addEventListener('click', buyMultiplierUpgrade);

    updatePlayerPosition();
    updateScore();
    updateUpgradeButtons();
    updateBlocks();
});
