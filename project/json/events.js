const seasonEvents = [
    {
        title: "Regeländerungen",
        desc: "Die FIA hat die Regeln massiv geändert. Ein Investment könnte dir den Vorsprung sichern.",
        cost: 2000000,
        effect: "random_shift"
    },
    {
        title: "Motoren-Upgrade",
        desc: "Dein Motorenlieferant bietet ein Performance-Paket an.",
        cost: 1500000,
        effect: "boost_player"
    },
    {
        title: "Budget-Krise",
        desc: "Sponsoren ziehen sich zurück. Dein Budget ist knapp, aber du kannst investieren, um das Auto zu retten.",
        cost: 500000,
        effect: "random_shift"
    },
    {
        title: "Aerodynamik-Durchbruch",
        desc: "Deine Ingenieure haben eine neue Aero-Lösung entwickelt.",
        cost: 1200000,
        effect: "boost_player"
    },
    {
        title: "Team-Umbau",
        desc: "Der Technische Direktor wurde neu besetzt.",
        cost: 800000,
        effect: "random_shift"
    },
    {
        title: "Sponsor-Bonus",
        desc: "Ein großer Sponsor ist begeistert und gibt dir extra Budget.",
        cost: -1000000,
        effect: "none"
    },
    {
        title: "Test-Event",
        desc: "Zusätzliche Testfahrten kosten Geld, verbessern aber die Basis.",
        cost: 1000000,
        effect: "boost_player"
    },
    {
        title: "Chassis-Optimierung",
        desc: "Du kannst das Gewicht deines Autos reduzieren.",
        cost: 1800000,
        effect: "boost_player"
    },
    {
        title: "Technisches Reglement",
        desc: "Die Autos müssen schwerer werden. Investiere, um die Balance zu halten.",
        cost: 2000000,
        effect: "random_shift"
    },
    {
        title: "Kultur-Wandel",
        desc: "Das Team braucht Motivation durch bessere Einrichtungen.",
        cost: 900000,
        effect: "boost_player"
    },
    {
        title: "Top-Team Angebot",
        desc: "Ein Top-Team hat deine Leistungen beobachtet. Möchtest du wechseln?",
        cost: 0,
        type: "transfer",
        effect: "team_switch"
    },
    {
        title: "Wechsel-Angebot",
        desc: "Ein anderes Team sucht einen neuen Fahrer für die nächste Saison.",
        cost: 0,
        type: "transfer",
        effect: "team_switch"
    }
];