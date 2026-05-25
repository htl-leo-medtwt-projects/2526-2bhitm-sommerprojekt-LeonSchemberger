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
    document.getElementById('career-hub').style.display = 'none';
    document.getElementById('race-prep').style.display = 'flex';
    generateWeather(0);
}

function careerHub() {
    document.getElementById('race-calendar').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex';
}

function backHome() {
    document.getElementById('race-results').style.display = 'none';
    document.getElementById('race-calendar').style.display = 'flex';

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
}

let currentRaceIndex = 0;

let player = {
    name: "",
    age: 0,
    team: "",
    money: parseInt(localStorage.getItem("playerMoney")) || 0,
    look: ""
};

function setAge(age) {
    player.age = age;
    document.getElementById("player-age").value = age;
}

function selectGoal(target, reward) {
    selectedStrategy.goal = target;
    selectedStrategy.goalReward = reward;
}

function wmStanding() {
    const container = document.querySelector('.drivers');
    let table = "";

    table += `
    <div class="driver-row">
        <span class="pos">1</span>
        <span class="name">${player.name} (DU)</span>
        <span class="pts">0 PTS</span>
    </div>`;

    for (let i = 0; i < driversData.length; i++) {
        const driver = driversData[i];
        table += `
            <div class="driver-row">
                <span class="pos">${i + 2}</span>
                <span class="name">${driver.name}</span>
                <span class="pts">0 PTS</span>
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
    const error = document.getElementById('error');

    if (player.name === "" || player.age == 0 || player.team === "") {
        error.innerHTML = "<div>Bitte füllen Sie alles aus!</div>";
        return;
    }

    error.innerHTML = "";
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

function selectTire(tireType) { selectedStrategy.tire = tireType; }
function selectSetup(setupType) { selectedStrategy.setup = setupType; }
function selectAggression(aggressionType) { selectedStrategy.aggression = aggressionType; }

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

const punktesystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

function startRace() {
    if (selectedStrategy.goal === 0 || selectedStrategy.tire === "" || selectedStrategy.setup === "" || selectedStrategy.aggression === "") {
        return;
    }

    const currentTrack = tracksData[currentRaceIndex];

    document.getElementById('race-prep').style.display = 'none';
    document.getElementById('race-results').style.display = 'flex';

    let rennergebnisse = [];

    let playerDriverObj = { team: player.team };
    let playerPower = calculateRacePerformance(playerDriverObj, true, currentTrack);

    rennergebnisse.push({
        name: player.name + " (DU)",
        score: playerPower,
        isPlayer: true
    });

    for (let i = 0; i < driversData.length; i++) {
        let driver = driversData[i];
        let aiPower = calculateRacePerformance(driver, false, currentTrack);

        rennergebnisse.push({
            name: driver.name,
            score: aiPower,
            isPlayer: false
        });
    }

    rennergebnisse.sort((a, b) => b.score - a.score);

    let playerPosition = rennergebnisse.findIndex(p => p.isPlayer) + 1;
    let playerFinished = rennergebnisse[playerPosition - 1].score !== -1;

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
            earnedPoints = punktesystem[playerPosition - 1];
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

    document.getElementById("res-money").innerHTML = `Ziel Geld: + ${earnedMoney.toLocaleString()} €`;
    document.getElementById("res-balance").innerHTML = `KONTOSTAND: ${player.money.toLocaleString()} €`;

    document.getElementById("res-summary").innerHTML = summaryText;

    updateHub();
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