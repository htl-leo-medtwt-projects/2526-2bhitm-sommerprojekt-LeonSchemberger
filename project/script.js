function createCharakter() {
    document.getElementById('start-menu').style.display = 'none';

    document.getElementById('char-creator').style.display = 'flex';
}

function raceCalendar() {
    document.getElementById('career-hub').style.display = 'none';

    document.getElementById('race-calendar').style.display = 'flex';
}

function depart() {
    document.getElementById('career-hub').style.display = 'none';

    document.getElementById('race-prep').style.display = 'flex';

    generateWeather(0);
}

function careerHub() {
    document.getElementById('race-calendar').style.display = 'none';

    document.getElementById('career-hub').style.display = 'flex'
}

function backHome() {
    document.getElementById('race-results').style.display = 'none';

    document.getElementById('race-calendar').style.display = 'flex';
}

let player = {
    name: "",
    age: 0,
    team: "",
    money: 0,
    look: ""
};

function setAge(age) {
    player.age = age;
    document.getElementById("player-age").value = age;
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
    document.getElementById("hub-player-name").innerHTML = "Name: " + player.name;
    document.getElementById("player-team").innerHTML = "Team: " + player.team;
    document.getElementById("player-money").innerHTML = "Geld: " + player.money + "€";

    if (player.age === 19) player.look = "img/Looks/Look1-young.png";
    if (player.age === 30) player.look = "img/Looks/Look2-old.png";
    if (player.age === 23) player.look = "img/Looks/Look3-mid.png";

    const charDiv = document.getElementById("charakter");
    charDiv.innerHTML = `<img src ="${player.look}" style="width: 180px; margin-top: 20px">`;

    const nextRace = tracksData[0];
    const raceBox = document.querySelector("#next-race-box .race-details");

    raceBox.querySelector('h3').innerHTML = nextRace.name;
    document.getElementById('track-country').innerHTML = "Land: " + nextRace.country;
    document.getElementById('track-city').innerHTML = "Stadt: " + nextRace.city
    raceBox.querySelector('.track-map').src = nextRace.track_image;
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
    document.getElementById('career-hub').style.display = 'flex'

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

function selectTire(tireType) {
    selectedStrategy.tire = tireType;
}

function selectSetup(setupType) {
    selectedStrategy.setup = setupType;
}

function selectAggression(aggressionType) {
    selectedStrategy.aggression = aggressionType;
}

function calculateRacePerformance(driver, myPlayer, track) {
    let team = teamsData.find(t => t.name === driver.team);
    let carPower = team ? team.car_performance : 70;

    let score = 0;
    let dnfChance = 0.02 + (track.difficulty * 0.01);

    if (myPlayer === true) {
        score = carPower;

        if (selectedStrategy.isRainRace === true) {
            if (selectedStrategy.tire === 'WET') score = score + 15;
            else if (selectedStrategy.tire === 'INTER') score = score + 8;
            else if (selectedStrategy.tire === 'SOFT') score = score - 35;
            else if (selectedStrategy.tire === 'MEDIUM') score = score - 40;
            else if (selectedStrategy.tire === 'HARD') score = score - 50;
        } else {
            if (selectedStrategy.tire === 'SOFT') score = score + 10;
            else if (selectedStrategy.tire === 'MEDIUM') score = score + 5;
            else if (selectedStrategy.tire === 'HARD') score = score + 2;
        }

        if (selectedStrategy.isRainRace === true) {
            if (selectedStrategy.setup === 'wet') score = score + 10;
            else if (selectedStrategy.setup === 'balanced') score = score + 4;
            else if (selectedStrategy.setup === 'dry') score = score - 15;
        } else {
            if (selectedStrategy.setup === 'dry') score = score + 10;
            else if (selectedStrategy.setup === 'balanced') score = score + 4;
            else if (selectedStrategy.setup === 'wet') score = score - 15;
        }

        if (selectedStrategy.aggression === 'risiko') {
            score = score + 5;
            dnfChance = dnfChance + 0.10;
        }
        else if (selectedStrategy.aggression === 'ausgewogen') {
            score = score + 5;
        }
        else if (selectedStrategy.aggression === 'calm') {
            score = score + 2;
            dnfChance = dnfChance - 0.01;
        }

    } else {
        if (track.difficulty >= 4) {
            score = (driver.skill * 0.5) + (carPower * 0.5);
        } else {
            score = (driver.skill * 0.3) + (carPower * 0.7);
        }

        let randomFactor = (Math.random() * 10) - 5;
        score = score + randomFactor;
    }

    if (Math.random() < dnfChance) {
        return -1;
    }

    return score;
}

function startRace() {
    if (selectedStrategy.tire === "" || selectedStrategy.setup === "" || selectedStrategy.aggression === "") {
        return;
    }

    document.getElementById('race-prep').style.display = 'none';
    document.getElementById('race-results').style.display = 'flex';
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