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
}

function careerHub() {
    document.getElementById('race-calendar').style.display = 'none';

    document.getElementById('career-hub').style.display = 'flex'
}

function startRace() {
    document.getElementById('race-prep').style.display = 'none';

    document.getElementById('race-results').style.display = 'flex';
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

function updateHub() {
    document.getElementById("hub-player-name").innerHTML = "Name: " + player.name;
    document.getElementById("player-team").innerHTML = "Team: " + player.team;
    document.getElementById("player-money").innerHTML = "Geld: " + player.money + "€";

    if (player.age === 19) player.look = "img/Looks/Look1-young.png";
    if (player.age === 30) player.look = "img/Looks/Look2-old.png";
    if (player.age === 23) player.look = "img/Looks/Look3-mid.png";

    const charDiv = document.getElementById("charakter");
    charDiv.innerHTML = `<img src ="${player.look}" style="width: 180px; margin-top: 20px">`;

    if (tracks.length > 0) {
        const nextRace = track[0];
        const raceBox = document.querySelector("#next-race-box .race-details");

        raceBox.querySelector('h3').innerHTML = nextRace.name;
        raceBox.querySelector('p').innerHTML = nextRace.city + " (" + nextRace.country + ")";
        raceBox.querySelector('.track-map').src = nextRace.track_image;
    }
}

function savePlayer() {
    player.name = document.getElementById("player-name").value;
    player.team = document.getElementById("team-select").value;

    if (player.name === "" || player.age == 0 || player.team === "") {
        alert("Bitte füllen Sie alles aus!");
        return;
    }

    document.getElementById('char-creator').style.display = 'none';
    document.getElementById('career-hub').style.display = 'flex'

    updateHub();
}