const seasonEvents = [
    {
        title: "Regeländerungen",
        desc: "Die FIA hat die Regeln massiv geändert. Ein Investment könnte dir den Vorsprung sichern.",
        cost: 2000000,
        effect: "random_shift",
        btn1Text: "Investieren (-2M €)",
        btn2Text: "Ignorieren (0 €)"
    },
    {
        title: "Motoren-Upgrade",
        desc: "Dein Motorenlieferant bietet ein Performance-Paket an.",
        cost: 1500000,
        effect: "boost_player",
        btn1Text: "Upgrade kaufen (-1.5M €)",
        btn2Text: "Standard behalten (0 €)"
    },
    {
        title: "Budget-Krise",
        desc: "Sponsoren ziehen sich zurück. Dein Budget ist knapp, aber du kannst investieren, um das Auto zu retten.",
        cost: 500000,
        effect: "random_shift",
        btn1Text: "Auto retten (-500k €)",
        btn2Text: "Risiko eingehen (0 €)"
    },
    {
        title: "Aerodynamik-Durchbruch",
        desc: "Deine Ingenieure haben eine neue Aero-Lösung entwickelt.",
        cost: 1200000,
        effect: "boost_player",
        btn1Text: "Aero-Paket kaufen (-1.2M €)",
        btn2Text: "Alte Aero behalten (0 €)"
    },
    {
        title: "Team-Umbau",
        desc: "Der Technische Direktor wurde neu besetzt.",
        cost: 800000,
        effect: "random_shift",
        btn1Text: "Umbau finanzieren (-800k €)",
        btn2Text: "Struktur belassen (0 €)"
    },
    {
        title: "Sponsor-Bonus",
        desc: "Ein großer Sponsor ist begeistert und gibt dir extra Budget.",
        cost: -1000000,
        effect: "none",
        btn1Text: "Bonus kassieren (+1M €)",
        btn2Text: "Ablehnen (0 €)"
    },
    {
        title: "Test-Event",
        desc: "Zusätzliche Testfahrten kosten Geld, verbessern aber die Basis.",
        cost: 1000000,
        effect: "boost_player",
        btn1Text: "Testen (-1M €)",
        btn2Text: "Nicht testen (0 €)"
    },
    {
        title: "Chassis-Optimierung",
        desc: "Du kannst das Gewicht deines Autos reduzieren.",
        cost: 1800000,
        effect: "boost_player",
        btn1Text: "Optimierung (-1.8M €)",
        btn2Text: "Ignorieren (0 €)"
    },
    {
        title: "Technisches Reglement",
        desc: "Die Autos müssen schwerer werden. Investiere, um die Balance zu halten.",
        cost: 2000000,
        effect: "random_shift",
        btn1Text: "Balance-Update (-2M €)",
        btn2Text: "Risiko gehen (0 €)"
    },
    {
        title: "Kultur-Wandel",
        desc: "Das Team braucht Motivation durch bessere Einrichtungen.",
        cost: 900000,
        effect: "boost_player",
        btn1Text: "Einrichtung ausbauen (-900k €)",
        btn2Text: "Nichts ändern (0 €)"
    },
    {
        title: "Top-Team Angebot",
        desc: "Ein Top-Team hat deine Leistungen beobachtet. Möchtest du wechseln?",
        cost: 0,
        type: "transfer",
        effect: "team_switch",
        btn1Text: "Vertrag annehmen",
        btn2Text: "Team treu bleiben"
    },
    {
        title: "Wechsel-Angebot",
        desc: "Ein anderes Team sucht einen neuen Fahrer für die nächste Saison.",
        cost: 0,
        type: "transfer",
        effect: "team_switch",
        btn1Text: "Angebot annehmen",
        btn2Text: "Ablehnen"
    }
];