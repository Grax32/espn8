# Dodge-ball Full-Coverage Plan

This is Eccentric Sports News' special full coverage of the Dodge-ball Final
Eight single-elimination tournament.

## Tournament format

The eight ranked teams enter a seven-day tournament. One team is eliminated in
each opening-round game, two teams are eliminated in the semifinals, and the
Saturday winner is champion.

| Day | Day of week | Round | Matches | Result |
| --- | --- | --- | --- | --- |
| 1 | Sunday | Quarterfinal 1 | 1 vs. 8 | One team eliminated |
| 2 | Monday | Quarterfinal 2 | 4 vs. 5 | One team eliminated |
| 3 | Tuesday | Quarterfinal 3 | 2 vs. 7 | One team eliminated |
| 4 | Wednesday | Quarterfinal 4 | 3 vs. 6 | One team eliminated |
| 5 | Thursday | Semifinal 1 | Winners of Days 1 and 2 | One team eliminated |
| 6 | Friday | Semifinal 2 | Winners of Days 3 and 4 | One team eliminated |
| 7 | Saturday | Championship | Winners of Days 5 and 6 | Champion crowned |

## Day-aware coverage

JavaScript determines the active tournament day from the current weekday:
Sunday is Day 1 and Saturday is Day 7. For editorial review and demonstration,
the browser console supports `set-day 3`, replacing `3` with any number from
`1` through `7` to force the active coverage day.

Every day view shows only the bracket, teams, game results, eliminations, and
coverage that are known through the selected day. It must not expose scheduled
matches, winners, scores, or championship information from a later day.

## Results source

The tournament's winners and game results will be selected before coverage
launch and stored in seven same-format files: `results/day-1.json` through
`results/day-7.json`. Each file contains only information known through its
own tournament day, so the site can load the matching file without revealing a
future outcome.

Each result should include the day, round, competing teams, winner, loser,
score, and coverage notes. Semifinal and championship participants should be
derived from the earlier winners rather than displayed before their qualifying
games have appeared.

## Coverage on every day

Each eligible day view includes:

- The event header and current tournament day.
- The completed bracket and eliminations through that day.
- Results and recaps for games already played.
- Current rankings and team context for teams still alive.
- No future results or downstream matchup information.
