const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navigation?.addEventListener('click', event => {
  if (event.target.matches('a')) {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
  }
});

const teams = [
  'Detroit Detonators',
  'Cleveland Crankshafts',
  'Charlotte Chargers',
  'Chicago Chicanes',
  'Austin Afterburners',
  'Seattle Slipstreams',
  'Phoenix Powerplays',
  'Baltimore Boltcutters'
];

const roundLabel = round => round === 'Championship' ? round : `${round}s`;
const currentTournamentDay = () => new Date().getDay() + 1;

function selectedDay() {
  const requestedDay = Number.parseInt(new URLSearchParams(window.location.search).get('day'), 10);
  return Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= 7
    ? requestedDay
    : currentTournamentDay();
}

function renderScoreCard(card, game, day) {
  if (!game) {
    card.hidden = true;
    return;
  }

  const [winnerScore, loserScore] = game.score.split('-');
  card.hidden = false;
  card.querySelector('p').textContent = `${game.round} · Final / Day ${day}`;
  const rows = card.querySelectorAll('div');
  rows[0].querySelector('span').textContent = game.winner;
  rows[0].querySelector('strong').textContent = winnerScore;
  rows[1].querySelector('span').textContent = game.loser;
  rows[1].querySelector('strong').textContent = loserScore;
}

function renderTeamRecords(results) {
  const records = new Map(teams.map(team => [team, { wins: 0, losses: 0 }]));
  results.completedGames.forEach(game => {
    records.get(game.winner).wins += 1;
    records.get(game.loser).losses += 1;
  });

  const standings = [...records.entries()].sort(([, a], [, b]) =>
    b.wins - a.wins || a.losses - b.losses
  );
  const list = document.querySelector('#team-record-list');
  list.replaceChildren(...standings.map(([team, record]) => {
    const item = document.createElement('li');
    const name = document.createElement('span');
    const score = document.createElement('strong');
    name.textContent = team;
    score.textContent = `${record.wins}–${record.losses}`;
    item.append(name, score);
    return item;
  }));
}

function renderDailyCoverage(results, day) {
  const latestGame = results.completedGames.at(-1);
  const previousGame = results.completedGames.at(-2);
  const teamsRemaining = teams.length - results.eliminatedTeams.length;
  const gameSummary = latestGame
    ? `${latestGame.winner} defeated ${latestGame.loser} ${latestGame.score}. ${latestGame.coverageNote}`
    : 'No completed games are available yet.';

  document.title = `${results.headline} | Eccentric Sports News`;
  document.querySelector('#tournament-name').textContent = results.tournament;
  document.querySelector('#event-day').textContent = `Day ${day} · ${roundLabel(results.round)}`;
  document.querySelector('#daily-image').src = `coverage/day-${day}/main-image.png`;
  document.querySelector('#daily-image').alt = `${results.dayName} Dodge-ball Final Eight coverage`;
  document.querySelector('#image-label').textContent = `Dodge-ball / ${results.dayName}`;
  document.querySelector('#lead-kicker').textContent = `Dodge-ball · ${results.round} report`;
  document.querySelector('#daily-headline').textContent = results.headline;
  document.querySelector('#lead-dek').textContent = gameSummary;
  document.querySelector('#teams-remaining').textContent = `${teamsRemaining} teams remain`;
  document.querySelector('#games-completed').textContent = `${results.completedGames.length} of 7 games completed`;
  document.querySelector('#record-subtitle').textContent = `Tournament W–L · Through Day ${day}`;
  document.querySelector('#eliminated-teams').textContent = results.eliminatedTeams.length
    ? `${results.eliminatedTeams.join(', ')} eliminated.`
    : 'No teams eliminated.';
  document.querySelector('#recap-kicker').textContent = `Day ${day} recap`;
  document.querySelector('#recap-heading').textContent = results.headline;
  document.querySelector('#recap-copy').textContent = gameSummary;
  document.querySelector('#footer-day').textContent = `Final Eight · Day ${day} snapshot`;

  renderScoreCard(document.querySelector('#latest-score'), latestGame, day);
  renderScoreCard(document.querySelector('#previous-score'), previousGame, day);
  renderTeamRecords(results);
}

async function loadDailyCoverage() {
  const day = selectedDay();
  try {
    const response = await fetch(`coverage/day-${day}/results.json`);
    if (!response.ok) throw new Error(`Unable to load results for day ${day}`);
    const results = await response.json();
    renderDailyCoverage(results, day);
  } catch (error) {
    console.error(error);
    document.querySelector('#daily-headline').textContent = 'Daily coverage is temporarily unavailable.';
  }
}

loadDailyCoverage();
