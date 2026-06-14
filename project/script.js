//Soundeffects
const audioFiles = {
    beep: new Audio('sounds/effects/beep.mp3'),
    save: new Audio('sounds/effects/save.mp3'),
    woosh: new Audio('sounds/effects/woosh.mov'),
    radio: new Audio('sounds/effects/radio.mp3'),
    goal: new Audio('sounds/effects/goal.mp3'),
    tire: new Audio('sounds/effects/tire.mp3'),
    setup: new Audio('sounds/effects/setup.mp3'),
    payout: new Audio('sounds/effects/payout.mp3'),
    abreisen: new Audio('sounds/effects/abreisen.mov'),
    ampeln: new Audio('sounds/effects/ampeln.mov'),
    aggression: new Audio('sounds/effects/aggression.mp3')
};

function play(soundName) {
    if (audioFiles[soundName]) {
        audioFiles[soundName].currentTime = 0;
        audioFiles[soundName].play();
    }
}

function createCharakter() {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('char-creator').style.display = 'flex';
    play('beep');
}

function savePlayer() {
    player.name = document.getElementById("player-name").value;
    player.team = document.getElementById("team-select").value;

    replaceWorstDriver(player.team);

    document.getElementById('char-creator').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex';

    updateHub();
    wmStanding();

    if (typeof menuMusic !== 'undefined') {
        isMenuMuted = false;
        menuMusic.currentTime = 0;
        menuMusic.play();

        const onImg = document.getElementById('menu-music-on-img');
        const offImg = document.getElementById('menu-music-off-img');

        if (onImg && offImg) {
            onImg.style.display = 'block';
            offImg.style.display = 'none';
        }
    }
    play('save');
}

function raceCalendar() {
    document.getElementById('career-hub').style.display = 'none';
    document.getElementById('race-calendar').style.display = 'flex';
    play('woosh');
}

function careerHub() {
    document.getElementById('race-calendar').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex';
    play('woosh');
}

function depart() {
    if (currentRaceIndex >= tracksData.length) {
        return;
    }

    const currentTrack = tracksData[currentRaceIndex];

    document.getElementById('prep-race-title').innerHTML = `${currentTrack.country.toUpperCase()} GRAND PRIX`;

    document.getElementById('career-hub').style.display = 'none';
    document.getElementById('race-prep').style.display = 'flex';
    generateWeather(currentRaceIndex);
    play('abreisen');
}

function loadingScreen() {
    document.getElementById('race-prep').style.display = 'none';
    document.getElementById('race-start-lights').style.display = 'flex';
    runLights();
}

let decisionImpact = {
    scoreBonus: 0,
    additionalDnfChance: 0,
    chosenText: ""
};

function backHome() {
    if (currentRaceIndex >= tracksData.length) {
        document.getElementById('race-results').style.filter = "blur(10px)";
        showSeasonSummary();
        return;
    }

    if (typeof resultMusic !== 'undefined') {
        resultMusic.pause();
        resultMusic.currentTime = 0;
    }

    document.getElementById('race-results').style.display = 'none';
    document.getElementById('race-calendar').style.display = 'flex';

    if (!isMenuMuted && typeof menuMusic !== 'undefined') {
        menuMusic.currentTime = 0;
        menuMusic.play();

        const onImg = document.getElementById('char-music-on-img');
        const offImg = document.getElementById('char-music-off-img');
        if (onImg && offImg) {
            onImg.style.display = 'block';
            offImg.style.display = 'none';
        }
    }

    //Damit der Slider, bei einem neuen Rennen, wieder auf die erste Seite zurückspringt, wurde Gemini gefragt
    if (typeof swiper !== 'undefined') {
        swiper.slideTo(0, 0);
    }

    selectedStrategy = {
        goal: 0,
        tire: "",
        setup: "",
        aggression: "",
        isRainRace: false
    };

    decisionImpact = {
        scoreBonus: 0,
        additionalDnfChance: 0,
        chosenText: ""
    };

    checkStrategy();

    document.querySelectorAll('.box-style button').forEach(button => {
        button.classList.remove('selected');
    });
}

let currentRaceIndex = 0;
let tireWear = 0;
let tireHealth = 100;

let player = {
    name: "",
    age: 0,
    team: "",
    money: parseInt(localStorage.getItem("playerMoney")) || 0,
    look: "",
    points: 0
};

function checkPlayer() {

    const name = document.getElementById("player-name").value;
    const team = document.getElementById("team-select").value;
    const age = player.age;
    const saveBtn = document.getElementById("save-btn");

    if (name === "" || age === 0 || team === "") {
        saveBtn.disabled = true;
        saveBtn.style.opacity = "0.5";
        saveBtn.style.cursor = "not-allowed";
    } else {
        saveBtn.disabled = false;
        saveBtn.style.opacity = "1";
        saveBtn.style.cursor = "pointer";
        saveBtn.style.filter = "none";
    }
}

function checkStrategy() {
    const startBtn = document.getElementById("start-race-btn");

    if (selectedStrategy.goal === 0 || selectedStrategy.tire === "" || selectedStrategy.setup === "" || selectedStrategy.aggression === "") {
        startBtn.disabled = true;
        startBtn.style.opacity = "0.5";
        startBtn.style.cursor = "not-allowed";
        startBtn.style.filter = "grayscale(1) brightness(0.4)";
    } else {
        startBtn.disabled = false;
        startBtn.style.opacity = "1";
        startBtn.style.cursor = "pointer";
        startBtn.style.filter = "none";
    }
}

//Sorgt dafür, dass die Klicks direkt mitgezählt werden
document.getElementById("player-name").addEventListener("input", checkPlayer);
document.getElementById("team-select").addEventListener("change", checkPlayer);
document.getElementById("char-card1").addEventListener("click", checkPlayer);
document.getElementById("char-card2").addEventListener("click", checkPlayer);
document.getElementById("char-card3").addEventListener("click", checkPlayer);

function setAge(age) {
    player.age = age;
    document.getElementById("player-age").value = age;
    checkPlayer();
}

function selectGoal(target, reward) {
    selectedStrategy.goal = target;
    selectedStrategy.goalReward = reward;
    checkStrategy();
    play('goal');
}

function wmStanding() {
    const container = document.querySelector('.drivers');
    if (!container) return;

    let allDrivers = [];

    allDrivers.push({
        name: player.name + " (DU)",
        points: player.points || 0,
        isPlayer: true
    });

    for (let i = 0; i < driversData.length; i++) {
        let driver = driversData[i];
        allDrivers.push({
            name: driver.name,
            points: driver.points || 0,
            isPlayer: false
        });
    }

    allDrivers.sort((a, b) => b.points - a.points);

    let table = "";
    for (let i = 0; i < allDrivers.length; i++) {
        const driver = allDrivers[i];
        let highlightClass = "";
        if (driver.isPlayer) {
            highlightClass = "player-highlight";
        }

        table += `
            <div class="driver-row ${highlightClass}">
                <span class="pos">${i + 1}</span>
                <span class="name">${driver.name}</span>
                <span class="pts">${driver.points} PTS</span>
            </div>
        `;
    }
    container.innerHTML = table;
}

function updateHub() {
    document.getElementById("player-money").innerHTML = "Geld: " + player.money.toLocaleString() + " €";
    document.getElementById("hub-player-name").innerHTML = "Name: " + player.name;
    document.getElementById("player-team").innerHTML = "Team: " + player.team;

    if (player.age === 19) player.look = "img/Looks/Look1-young.png";
    if (player.age === 30) player.look = "img/Looks/Look2-old.png";
    if (player.age === 23) player.look = "img/Looks/Look3-mid.png";

    const charDiv = document.getElementById("charakter");
    charDiv.innerHTML = `<img src ="${player.look}" style="width: 180px; margin-top: 20px">`;

    let displayIndex = currentRaceIndex;
    if (displayIndex >= tracksData.length) {
        displayIndex = 0;
    }

    const nextRace = tracksData[displayIndex];
    const raceBox = document.querySelector("#next-race-box .race-details");

    raceBox.querySelector('h3').innerHTML = nextRace.name;
    document.getElementById('track-country').innerHTML = "Land: " + nextRace.country;
    document.getElementById('track-city').innerHTML = "Stadt: " + nextRace.city;
    raceBox.querySelector('.track-map').src = nextRace.track_image;

    document.querySelectorAll('.track-card').forEach((card, index) => {
        if (index === displayIndex) {
            card.classList.add('active');
            card.style.opacity = "1";
            card.style.filter = "none";
        } else if (index < currentRaceIndex) {
            card.classList.remove('active');
            card.style.opacity = "0.4";
            card.style.filter = "grayscale(1) brightness(0.7)";
        } else {
            card.classList.remove('active');
            card.style.opacity = "1";
            card.style.filter = "none";
        }
    });
}

//Um den schlechteren Fahrer des beigetreten Teams zu ersetzten wurde Gemini gefragt
function replaceWorstDriver(selectedTeamName) {
    let teamDrivers = driversData.filter(d => d.team === selectedTeamName);

    if (teamDrivers.length > 0) {
        teamDrivers.sort((a, b) => a.skill - b.skill);
        let worstDriver = teamDrivers[0];
        const index = driversData.indexOf(worstDriver);
        if (index !== -1) {
            driversData.splice(index, 1);
            console.log(`${worstDriver.name} wurde entlassen, um Platz für ${player.name} zu machen.`);
        }
    }
}

let selectedStrategy = {
    goal: 0,
    tire: "",
    setup: "",
    aggression: "",
    isRainRace: false
};

function generateWeather(trackIndex) {
    const weatherBox = document.getElementById("weather-info-box");
    const rainRow = document.querySelector(".rain-locked");
    const currentTrack = tracksData[trackIndex];
    const random = Math.random();

    if (random < currentTrack.rain_chance) {
        selectedStrategy.isRainRace = true;
        weatherBox.innerHTML = "<div>VORHERSAGE - REGEN</div>";
        rainRow.style.opacity = "1";
        rainRow.style.pointerEvents = "auto";
        rainRow.style.filter = "none";
    } else {
        selectedStrategy.isRainRace = false;
        weatherBox.innerHTML = "<div>VORHERSAGE - SONNIG</div>";
        rainRow.style.opacity = "0.3";
        rainRow.style.pointerEvents = "none";
    }
}

function selectTire(tireType) {
    selectedStrategy.tire = tireType; checkStrategy();
    play('tire');
}

function selectSetup(setupType) {
    selectedStrategy.setup = setupType; checkStrategy();
    play('setup');
}

function selectAggression(aggressionType) {
    selectedStrategy.aggression = aggressionType; checkStrategy();
    play('aggression');
}

function calculateRacePerformance(driver, myPlayer, track) {
    let team = teamsData.find(t => driver && driver.team && t.name.toLowerCase().includes(driver.team.toLowerCase()));
    let carPower = 70;
    if (team) {
        carPower = team.car_performance;
    }

    let score = 0;
    let dnfChance = 0.02 + (track.difficulty * 0.01);

    if (myPlayer === true) {
        score = carPower;

        score += decisionImpact.scoreBonus;
        dnfChance += decisionImpact.additionalDnfChance;

        if (selectedStrategy.isRainRace === true) {
            if (selectedStrategy.tire === 'WET') score += 12;
            else if (selectedStrategy.tire === 'INTER') score += 6;
            else if (selectedStrategy.tire === 'SOFT') score -= 30;
            else if (selectedStrategy.tire === 'MEDIUM') score -= 35;
            else if (selectedStrategy.tire === 'HARD') score -= 45;
        } else {
            if (selectedStrategy.tire === 'SOFT') score += 4;
            else if (selectedStrategy.tire === 'MEDIUM') score += 2;
            else if (selectedStrategy.tire === 'HARD') score += 0;
        }

        if (selectedStrategy.isRainRace === true) {
            if (selectedStrategy.setup === 'wet') score += 8;
            else if (selectedStrategy.setup === 'balanced') score += 3;
            else if (selectedStrategy.setup === 'dry') score -= 15;
        } else {
            if (selectedStrategy.setup === 'dry') score += 6;
            else if (selectedStrategy.setup === 'balanced') score += 2;
            else if (selectedStrategy.setup === 'wet') score -= 15;
        }

        if (selectedStrategy.aggression === 'risiko') {
            score += 3;
            dnfChance += 0.12;
        }
        else if (selectedStrategy.aggression === 'ausgewogen') {
            score += 1;
        }
        else if (selectedStrategy.aggression === 'calm') {
            score -= 1;
            dnfChance -= 0.01;
        }

    } else {
        score = carPower;
        let aiRandom = (Math.random() * 4) - 2;
        score += aiRandom;
    }

    if (Math.random() < dnfChance) {
        return -1;
    }

    return score;
}

function runLights() {
    const bulbs = document.querySelectorAll('.light-bulb');
    const goBtn = document.getElementById('lights-go-btn');

    bulbs.forEach(b => b.classList.remove('red', 'green'));
    goBtn.style.display = 'none';

    const activateLight = (index) => {
        bulbs[index].classList.add('red');
        play('ampeln');
    };

    setTimeout(() => activateLight(0), 1000);
    setTimeout(() => activateLight(1), 2000);
    setTimeout(() => activateLight(2), 3000);
    setTimeout(() => activateLight(3), 4000);
    setTimeout(() => activateLight(4), 5000);

    const waitTime = 2000 + Math.random() * 1000;

    setTimeout(() => {
        bulbs.forEach(b => {
            b.classList.remove('red');
            b.classList.add('green');
        });
        goBtn.style.display = 'block';
    }, 5000 + waitTime);
}

const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

function startRace() {
    const currentTrack = tracksData[currentRaceIndex];

    let raceResults = [];

    let playerDriverObj = { team: player.team };
    let playerPower = calculateRacePerformance(playerDriverObj, true, currentTrack);

    raceResults.push({
        name: player.name + " (DU)",
        score: playerPower,
        isPlayer: true
    });

    for (let i = 0; i < driversData.length; i++) {
        let driver = driversData[i];
        let aiPower = calculateRacePerformance(driver, false, currentTrack);

        raceResults.push({
            name: driver.name,
            score: aiPower,
            isPlayer: false
        });
    }

    raceResults.sort((a, b) => b.score - a.score);

    //Es wurde viel mit der Inline Suggest von VS Code gearbeitet, damit die Punktevergabe korrekt funktioniert
    for (let i = 0; i < pointsSystem.length; i++) {
        if (raceResults[i] && raceResults[i].score !== -1) {
            let pointsForPosition = pointsSystem[i];

            if (raceResults[i].isPlayer) {
                player.points += pointsForPosition;
            } else {
                let kiDriver = driversData.find(d => d.name === raceResults[i].name);
                if (kiDriver) {
                    if (!kiDriver.points) kiDriver.points = 0;
                    kiDriver.points += pointsForPosition;
                }
            }
        }
    }

    let playerPosition = raceResults.findIndex(p => p.isPlayer) + 1;
    let playerFinished = raceResults[playerPosition - 1].score !== -1;

    let earnedPoints = 0;
    let earnedMoney = 0;
    let summaryText = "";

    if (!playerFinished) {
        playerPosition = "DNF";
        earnedPoints = 0;
        earnedMoney = 0;

        if (decisionImpact.additionalDnfChance > 0 && Math.random() < 0.7) {
            summaryText = `Deine Entscheidung für "${decisionImpact.chosenText}" führte zu einem fatalen Crash!`;
        } else if (selectedStrategy.aggression === 'risiko') {
            summaryText = "Deine aggressive Fahrweise hat dich leider ins Aus befördert.";
        } else {
            summaryText = "Leider hast du das Rennen aufgrund eines Defekts nicht beendet.";
        }
    } else {
        if (playerPosition <= 10) {
            earnedPoints = pointsSystem[playerPosition - 1];
        } else {
            earnedPoints = 0;
        }

        earnedMoney = currentTrack.base_reward;

        let goalAchieved = false;
        if (selectedStrategy.goal === "finish") {
            goalAchieved = true;
        } else if (selectedStrategy.goal === "top10" && playerPosition <= 10) {
            goalAchieved = true;
        } else if (selectedStrategy.goal === "top4" && playerPosition <= 4) {
            goalAchieved = true;
        }

        if (goalAchieved) {
            earnedMoney += selectedStrategy.goalReward;
        }

        player.money += earnedMoney;
        localStorage.setItem("playerMoney", player.money);

        if (playerPosition === 1) {
            summaryText = "Unglaublich! Du hast das Rennen gewonnen!";
        } else if (playerPosition === 2) {
            summaryText = "Super! Du hast den zweiten Platz erreicht!";
        } else if (playerPosition === 3) {
            summaryText = "Toll! Du hast es auf das Podium geschafft!";
        } else if (playerPosition < 10) {
            summaryText = `Gut gemacht! Du hast ${earnedPoints} Punkte gesammelt mit Platz ${playerPosition}.`;
        } else if (playerPosition === 10) {
            summaryText = `Gut gemacht! Du hast ${earnedPoints} Punkt gesammelt mit Platz 10.`;
        } else {
            summaryText = `Du hast das Rennen auf P${playerPosition} beendet, aber leider keine Punkte gesammelt.`;
        }
    }

    currentRaceIndex++;

    document.getElementById("res-pos").innerHTML = `Position: <b>${playerPosition}</b>`;
    document.getElementById("res-points").innerHTML = `+ ${earnedPoints} Punkte`;
    document.getElementById("res-summary").innerHTML = summaryText;

    let oldMoney = player.money - earnedMoney;
    let newMoney = player.money;

    document.getElementById("res-money").innerHTML = `Ziel Geld: + ${earnedMoney.toLocaleString()} €`;
    document.getElementById("res-balance").innerHTML = `KONTOSTAND: ${player.money.toLocaleString()} €`;

    const boxes = document.querySelectorAll('.box-style-result');
    boxes[0].style.animationDelay = '0.2s';
    boxes[1].style.animationDelay = '1.2s';
    boxes[2].style.animationDelay = '2.2s';

    setTimeout(() => {
        play('payout');

        let startTime = null;
        const duration = 1500;

        function animateCounters(currentTime) {
            if (!startTime) startTime = currentTime;
            let progress = currentTime - startTime;
            let percent = Math.min(progress / duration, 1);

            let currentEarned = Math.floor(earnedMoney * percent);
            let currentTotal = Math.floor(oldMoney + currentEarned);

            document.getElementById("res-money").innerHTML = `Ziel Geld: + ${currentEarned.toLocaleString()} €`;
            document.getElementById("res-balance").innerHTML = `KONTOSTAND: ${currentTotal.toLocaleString()} €`;

            if (progress < duration) requestAnimationFrame(animateCounters);
        }
        requestAnimationFrame(animateCounters);
    }, 1200);

    updateHub();
    wmStanding();

    if (typeof menuMusic !== 'undefined') {
        menuMusic.pause();
    }

    isResultMuted = false;
    resultMusic.currentTime = 0;
    resultMusic.play();
}

function showSeasonSummary() {
    const summaryScreen = document.getElementById('season-summary-screen');
    const statsDiv = document.getElementById('season-stats');

    //Damit der WM-Tabellen Rang herausgefindet wird, wurde Gemini gefragt
    let allDrivers = [...driversData, { name: player.name + " (DU)", points: player.points }];
    allDrivers.sort((a, b) => b.points - a.points);
    let rank = allDrivers.findIndex(d => d.name === player.name + " (DU)") + 1;
    let worldChampion = allDrivers[0].name;

    statsDiv.innerHTML = `
        <div style="font-size: 20px; margin-bottom: 20px;">
            <p>Weltmeister: <b style="color: #FFD700;">${worldChampion}</b></p>
            <hr style="border: 0; border-top: 1px solid #444; margin: 10px 0;">
            <p>Dein Team: <b>${player.team}</b></p>
            <p>Deine Punkte: <b>${player.points}</b></p>
            <p>Deine Platzierung: <b>Platz ${rank}</b></p>
        </div>
    `;

    summaryScreen.style.display = 'flex';
}

const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    effect: 'slide',
    resistanceRatio: 0,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

//Für die hervorhebung der Auswahl wurde Gemini gefragt
document.querySelectorAll('.box-style button').forEach(button => {
    button.addEventListener('click', function () {
        const currentSlide = this.closest('.swiper-slide');
        currentSlide.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.classList.add('selected');
    });
});

let activeEvent = null;
let currentRaceRound = 0;
let currentRadioAudio = null;

function raceDecision() {
    if (!raceEvents || raceEvents.length === 0) return;

    document.getElementById('race-start-lights').style.display = 'none';
    document.getElementById('race-event-screen').style.display = 'flex';

    const currentTrack = tracksData[currentRaceIndex];
    currentRaceRound = Math.floor(Math.random() * 25) + 10;
    document.getElementById('current-race-round-display').innerHTML = `RUNDE ${currentRaceRound} / ${currentTrack.rounds}`;

    let baseWearPerRound = 2.0;
    if (selectedStrategy.tire === 'SOFT') baseWearPerRound = 3.0;
    if (selectedStrategy.tire === 'HARD') baseWearPerRound = 1.0;
    if (selectedStrategy.tire === 'WET' || selectedStrategy.tire === 'INTER') baseWearPerRound = 3.5;

    let aggressionMultiplier = 1.0;
    if (selectedStrategy.aggression === 'risiko') aggressionMultiplier = 1.4;
    if (selectedStrategy.aggression === 'calm') aggressionMultiplier = 0.7;

    let randomFactor = (Math.random() * 6) - 3;
    //Damit die Reifen realsitsch abnutzen, wurde Gemini gefragt 
    tireWear = Math.min(Math.floor((baseWearPerRound * aggressionMultiplier * currentRaceRound) + randomFactor), 100);
    if (tireWear < 0) tireWear = 0;
    tireHealth = 100 - tireWear;

    const wearDisplay = document.getElementById('current-wear-value');
    wearDisplay.innerHTML = `${tireHealth}%`;

    if (tireHealth < 25) {
        wearDisplay.style.color = '#e10600';
    } else if (tireHealth < 55) {
        wearDisplay.style.color = '#ffaa00';
    } else {
        wearDisplay.style.color = '#00ff88';
    }

    const eventIndex = currentRaceIndex % raceEvents.length;
    activeEvent = raceEvents[eventIndex];

    document.getElementById('race-event-screen').style.backgroundImage = `url('img/Backgrounds/Entscheidungen/${activeEvent.image}')`;
    document.getElementById('event-btn-1').innerHTML = activeEvent.btn1Text;
    document.getElementById('event-btn-2').innerHTML = activeEvent.btn2Text;

    if (activeEvent && activeEvent.audio) {
        playRadioMessage(activeEvent.audio);
    }
}

function handleEventDecision(decisionNumber) {
    if (!activeEvent) return;

    if (currentRadioAudio) {
        currentRadioAudio.pause();
        currentRadioAudio.currentTime = 0;
    }

    decisionImpact.scoreBonus = 0;
    decisionImpact.additionalDnfChance = 0;

    if (decisionNumber === 1) {
        decisionImpact.chosenText = activeEvent.btn1Text;
    } else {
        decisionImpact.chosenText = activeEvent.btn2Text;
    }

    if (activeEvent.image === "AutoQuer.png") {
        if (decisionNumber === 1) {
            if (tireHealth < 30) {
                decisionImpact.scoreBonus = -25;
                decisionImpact.additionalDnfChance = 0.35;
            } else {
                decisionImpact.scoreBonus = 8;
            }
        } else {
            decisionImpact.scoreBonus = -3;
        }
    }

    else if (activeEvent.image === "BoxenstoppFehler.png") {
        if (decisionNumber === 2) {
            if (currentRaceRound <= 25) {
                decisionImpact.scoreBonus = -23;
            } else {
                decisionImpact.scoreBonus = 10;
            }
        } else {
            decisionImpact.scoreBonus = -5;
        }
    }

    else if (activeEvent.image === "BoxPoker.png") {
        if (decisionNumber === 1) {
            if (tireHealth < 35 && currentRaceRound > 20) {
                decisionImpact.scoreBonus = -40;
                decisionImpact.additionalDnfChance = 0.50;
            } else {
                decisionImpact.scoreBonus = 12;
            }
        } else {
            decisionImpact.scoreBonus = -10;
        }
    }

    else if (activeEvent.image === "Bremsduell.png") {
        if (decisionNumber === 1) {
            if (tireHealth < 30) {
                decisionImpact.scoreBonus = -30;
                decisionImpact.additionalDnfChance = 0.40;
            } else {
                decisionImpact.scoreBonus = 10;
            }
        } else {
            decisionImpact.scoreBonus = 5;
        }
    }

    else if (activeEvent.image === "Motor.png") {
        if (decisionNumber === 1) {
            if (currentRaceRound <= 28) {
                decisionImpact.scoreBonus = -35;
                decisionImpact.additionalDnfChance = 0.60;
            } else {
                decisionImpact.scoreBonus = 15;
            }
        } else {
            decisionImpact.scoreBonus = -5;
        }
    }

    else if (activeEvent.image === "Platten.png") {
        tireHealth = 0;
        if (decisionNumber === 2) {
            if (currentRaceRound <= 49) {
                decisionImpact.scoreBonus = -50;
            } else {
                decisionImpact.scoreBonus = 5;
            }
        } else {
            decisionImpact.scoreBonus = -10;
        }
    }

    else if (activeEvent.image === "Regen.png") {
        if (decisionNumber === 2) {
            if (tireHealth < 50 || currentRaceRound <= 75) {
                decisionImpact.scoreBonus = -40;
                decisionImpact.additionalDnfChance = 0.60;
            } else {
                decisionImpact.scoreBonus = 20;
            }
        } else {
            decisionImpact.scoreBonus = 5;
        }
    }

    else if (activeEvent.image === "Unfall.png") {
        if (decisionNumber === 1) {
            if (tireHealth < 40 || currentRaceRound <= 22) {
                decisionImpact.scoreBonus = 15;
            } else {
                decisionImpact.scoreBonus = -20;
            }
        } else {
            if (tireHealth < 40 || currentRaceRound <= 22) {
                decisionImpact.scoreBonus = -35;
                decisionImpact.additionalDnfChance = 0.30;
            } else {
                decisionImpact.scoreBonus = 10;
            }
        }
    }

    document.getElementById('race-event-screen').style.display = 'none';
    activeEvent = null;
    document.getElementById('race-results').style.display = 'flex';

    startRace();
}

function playRadioMessage(audioPath) {
    if (currentRadioAudio) {
        currentRadioAudio.pause();
        currentRadioAudio.currentTime = 0;
    }

    play('radio');

    setTimeout(() => {
        currentRadioAudio = new Audio(audioPath);
        currentRadioAudio.play();
    }, 800);
}

let menuMusic = new Audio('sounds/music/menu.mp3');
menuMusic.loop = true;
menuMusic.volume = 0.35;
let isMenuMuted = true;

let resultMusic = new Audio('sounds/music/result.mp3');
resultMusic.loop = true;
resultMusic.volume = 0.35;
let isResultMuted = false;

function toggleMenuMusic(event) {
    event.stopPropagation();

    const onImg = document.getElementById('menu-music-on-img');
    const offImg = document.getElementById('menu-music-off-img');

    if (!onImg || !offImg) return;

    if (isMenuMuted) {
        menuMusic.play();
        onImg.style.display = 'block';
        offImg.style.display = 'none';
        isMenuMuted = false;
    } else {
        menuMusic.pause();
        onImg.style.display = 'none';
        offImg.style.display = 'block';
        isMenuMuted = true;
    }
}

function startNewSeason() {
    document.getElementById('season-summary-screen').style.display = 'none';
    document.getElementById('race-results').style.display = 'none';

    const creator = document.getElementById('char-creator');
    creator.style.display = 'flex';
    creator.classList.add('blur-active');

    player.points = 0;
    currentRaceIndex = 0;
    tireWear = 0;
    tireHealth = 100;
    driversData.forEach(d => d.points = 0);

    if (typeof swiper !== 'undefined') {
        swiper.slideTo(0, 0);
    }

    selectedStrategy = {
        goal: 0,
        tire: "",
        setup: "",
        aggression: "",
        isRainRace: false
    };

    document.querySelectorAll('.box-style button').forEach(button => {
        button.classList.remove('selected');
    });

    checkStrategy();
    prepareSeasonEvents();
}

let currentEvent = null;

function prepareSeasonEvents() {
    let allDrivers = [...driversData, { name: player.name + " (DU)", points: player.points }];
    allDrivers.sort((a, b) => b.points - a.points);
    let playerRank = allDrivers.findIndex(d => d.name === player.name + " (DU)") + 1;

    let possibleTransfers = [];

    if (possibleTransfers.length > 0 && Math.random() < 0.5) {
        currentEvent = possibleTransfers[Math.floor(Math.random() * possibleTransfers.length)];
    } else if (typeof seasonEvents !== 'undefined' && seasonEvents.length > 0) {
        currentEvent = seasonEvents[Math.floor(Math.random() * seasonEvents.length)];
    }

    document.getElementById('event-title').textContent = currentEvent.title;
    document.getElementById('event-desc').textContent = currentEvent.desc;
    document.getElementById('event-current-money').innerHTML = `Dein Budget: <b>${player.money.toLocaleString()} €</b>`;

    let text1 = "Annehmen";
    if (currentEvent.btn1Text) {
        text1 = currentEvent.btn1Text;
    }

    let text2 = "Ablehnen";
    if (currentEvent.btn2Text) {
        text2 = currentEvent.btn2Text;
    }

    document.getElementById('season-btn-1').textContent = text1;
    document.getElementById('season-btn-2').textContent = text2;
    document.getElementById('season-event-screen').style.display = 'flex';
}

function handleSeasonDecision(accepted) {
    let oldPerf = 70;
    let myTeam = teamsData.find(t => t.name.toLowerCase().includes(player.team.toLowerCase()));
    if (myTeam) oldPerf = myTeam.car_performance;

    if (accepted) {
        player.money -= currentEvent.cost;
        localStorage.setItem("playerMoney", player.money);

        if (myTeam) {
            if (currentEvent.effect === "boost_player") {
                myTeam.car_performance += 5;
            } else {
                myTeam.car_performance += 2;
            }
        }
    }

    teamsData.forEach(t => {
        if (t !== myTeam) {
            t.car_performance += Math.floor(Math.random() * 7) - 2;
        }
    });

    if (myTeam) {
        document.getElementById('event-desc').innerHTML = `Dein Team hat sich entwickelt!<br><b>Performance: ${oldPerf} → ${myTeam.car_performance}</b><br><br>Die Konkurrenz hat ebenfalls Updates gebracht.`;
    } else {
        document.getElementById('event-desc').innerHTML = "Die Teams haben ihre Autos für die neue Saison angepasst.";
    }

    document.getElementById('event-title').textContent = "Winter-Tests Beendet!";

    document.getElementById('season-btn-1').textContent = "In den Hub starten";
    document.getElementById('season-btn-1').onclick = closeReportAndGoToHub;
    document.getElementById('season-btn-2').style.display = 'none';
}

function closeReportAndGoToHub() {
    document.getElementById('season-btn-2').style.display = 'inline-block';
    document.getElementById('season-btn-1').onclick = function () { handleSeasonDecision(true); };

    document.getElementById('char-creator').classList.remove('blur-active');
    document.getElementById('char-creator').style.display = 'none';
    document.getElementById('season-event-screen').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex';

    updateHub();
    wmStanding();
}