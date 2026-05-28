function createCharakter() {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('char-creator').style.display = 'flex';
}

function raceCalendar() {
    document.getElementById('career-hub').style.display = 'none';
    document.getElementById('race-calendar').style.display = 'flex';
}

function depart() {
    if (currentRaceIndex >= tracksData.length) {
        alert("Keine weiteren Rennen verfügbar!");
        return;
    }

    const currentTrack = tracksData[currentRaceIndex];

    document.getElementById('prep-race-title').innerHTML = `${currentTrack.country.toUpperCase()} GRAND PRIX`;

    document.getElementById('career-hub').style.display = 'none';
    document.getElementById('race-prep').style.display = 'flex';
    generateWeather(currentRaceIndex);
}

function careerHub() {
    document.getElementById('race-calendar').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex';
}

function backHome() {
    document.getElementById('race-results').style.display = 'none';
    document.getElementById('race-calendar').style.display = 'flex';

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

    checkStrategy();

    document.querySelectorAll('.box-style button').forEach(button => {
        button.classList.remove('selected');
    });
}

let currentRaceIndex = 0;

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
        const highlightClass = driver.isPlayer ? "player-highlight" : "";

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
        } else {
            card.classList.remove('active');
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

function savePlayer() {
    player.name = document.getElementById("player-name").value;
    player.team = document.getElementById("team-select").value;

    replaceWorstDriver(player.team);

    document.getElementById('char-creator').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex';

    updateHub();
    wmStanding();
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

function selectTire(tireType) { selectedStrategy.tire = tireType; checkStrategy(); }
function selectSetup(setupType) { selectedStrategy.setup = setupType; checkStrategy(); }
function selectAggression(aggressionType) { selectedStrategy.aggression = aggressionType; checkStrategy(); }

function calculateRacePerformance(driver, myPlayer, track) {
    let team = teamsData.find(t => driver && driver.team && t.name.toLowerCase().includes(driver.team.toLowerCase()));
    let carPower = team ? team.car_performance : 70;

    let score = 0;
    let dnfChance = 0.02 + (track.difficulty * 0.01);

    if (myPlayer === true) {
        score = carPower;

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

const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

function startRace() {
    const currentTrack = tracksData[currentRaceIndex];

    document.getElementById('race-prep').style.display = 'none';
    document.getElementById('race-results').style.display = 'flex';

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

        if (selectedStrategy.aggression === 'risiko') {
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

    let startTime = null;
    const duration = 1500;

    function animateMoney(currentTime) {
        if (!startTime) startTime = currentTime;
        let progress = currentTime - startTime;
        let percentage = Math.min(progress / duration, 1);

        let currentEarned = Math.floor(earnedMoney * percentage);
        let currentBalance = Math.floor(oldMoney + currentEarned);

        document.getElementById("res-money").innerHTML = `Ziel Geld: + ${currentEarned.toLocaleString()} €`;
        document.getElementById("res-balance").innerHTML = `KONTOSTAND: ${currentBalance.toLocaleString()} €`;
        
        if (progress < duration) {
            requestAnimationFrame(animateMoney);
        } else {
            document.getElementById("res-money").innerHTML = `Ziel Geld: + ${earnedMoney.toLocaleString()} €`;
            document.getElementById("res-balance").innerHTML = `KONTOSTAND: ${player.money.toLocaleString()} €`;
        }
    }
    
    requestAnimationFrame(animateMoney);

    updateHub();
    wmStanding();
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