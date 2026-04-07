function createCharakter() {
    document.getElementById('start-menu').style.display = 'none';

    document.getElementById('char-creator').style.display = 'flex';
}

function savePlayer() {
    document.getElementById('char-creator').style.display = 'none';

    document.getElementById('career-hub').style.display = 'flex'
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