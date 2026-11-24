const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const aboutSportDialog = document.querySelector('#about-dodge-ball');
const aboutSportTriggers = document.querySelectorAll('.about-sport-trigger');
const aboutSportClose = document.querySelector('.dialog-close');

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

function openAboutSportDialog() {
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
  aboutSportDialog?.showModal();
}

aboutSportTriggers.forEach(trigger => trigger.addEventListener('click', openAboutSportDialog));
aboutSportClose?.addEventListener('click', () => aboutSportDialog?.close());
aboutSportDialog?.addEventListener('click', event => {
  if (event.target === aboutSportDialog) aboutSportDialog.close();
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
const tournamentSchedule = [
  { day: 1, dayName: 'Sunday', round: 'Quarterfinal', teams: ['Detroit Detonators', 'Baltimore Boltcutters'] },
  { day: 2, dayName: 'Monday', round: 'Quarterfinal', teams: ['Cleveland Crankshafts', 'Phoenix Powerplays'] },
  { day: 3, dayName: 'Tuesday', round: 'Quarterfinal', teams: ['Charlotte Chargers', 'Seattle Slipstreams'] },
  { day: 4, dayName: 'Wednesday', round: 'Quarterfinal', teams: ['Chicago Chicanes', 'Austin Afterburners'] },
  { day: 5, dayName: 'Thursday', round: 'Semifinal', teams: ['Detroit Detonators', 'Cleveland Crankshafts'] },
  { day: 6, dayName: 'Friday', round: 'Semifinal', teams: ['Charlotte Chargers', 'Chicago Chicanes'] },
  { day: 7, dayName: 'Saturday', round: 'Championship', teams: ['Detroit Detonators', 'Charlotte Chargers'] }
];

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

function renderTournamentFeature(results, day) {
  const kicker = document.querySelector('#feature-kicker');
  const heading = document.querySelector('#feature-heading');
  const copy = document.querySelector('#feature-copy');
  const link = document.querySelector('#feature-link');
  const nextMatchup = tournamentSchedule.find(matchup => matchup.day === day + 1);

  if (nextMatchup) {
    kicker.textContent = 'Next matchup';
    heading.textContent = `${nextMatchup.teams[0]} vs. ${nextMatchup.teams[1]}`;
    copy.textContent = `${nextMatchup.round} · ${nextMatchup.dayName}. The Final Eight resumes with another chance to advance.`;
    link.textContent = 'Preview the matchup';
    link.href = '#scores';
    return;
  }

  const championship = results.completedGames.at(-1);
  kicker.textContent = 'Special presentation';
  heading.textContent = 'Quest for the Cup';
  copy.textContent = championship
    ? `${championship.winner} completed the Final Eight with a ${championship.score} championship win over ${championship.loser}. Relive the run to the cup.`
    : 'Relive the Final Eight and the run to the cup.';
  link.textContent = 'See the championship recap';
  link.href = '#daily-recap';
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
  renderTournamentFeature(results, day);
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
