import * as schedulingData from "./_scheduling-data.json";

export function getDailyAvailable(startingAtWhichDate = "2024-12-18T00:00:00+00:00", { mangleAgentHours = false, earliestTime = 5 * 60, latestTime = 23 * 60 } = {}) {
  const result = schedulingData;
  startingAtWhichDate = new Date(startingAtWhichDate);

  const increaseStartDateBy = (index) => {
    const d = new Date(startingAtWhichDate);
    d.setDate(d.getDate() + index);
    return d.toISOString();
  }

  const mangle = (agents) => {
    if (!mangleAgentHours) return agents;

    const granularity = 30;
    const noon = 12 * 60;

    return agents
      .map(({ agent, hours }) => {
        let lastEndTime = earliestTime;
        const time = (earliestTime, latestTime) => Math.floor(Math.random() * Math.floor((latestTime - earliestTime) / granularity)) * granularity + earliestTime;
        return {
          agent,
          hours: {
            data: hours.data,
            parsed: hours.parsed
              .map((hour, index) => {
                const dur = Math.floor(Math.random() * 5) * granularity;
                let et, lt;
                switch (index) {
                  case 0: et = earliestTime; lt = noon; break;
                  case 1: et = lastEndTime; lt = latestTime - (granularity * 4); break;
                  case 2: et = Math.min(lastEndTime, latestTime - dur); lt = latestTime - dur; break;
                }
                const startTime = !lt ? noon : time(lt, et);
                // console.log(et, el, startTime, dur);
                lastEndTime = startTime + dur;
                return { sta: startTime, fin: startTime + dur - 1, dur, };
              })
              .sort((a, b) => a.sta - b.sta),
          }
        }
      })
  }

  return result.data.ResultParameters.schedule.dailyAvailable
    .map(({ agents, ...day }, index) => {
      return {
        ...day,
        day: increaseStartDateBy(index),
        agents: mangle(agents)
      }
    });
}

export function combineAgentSchedulesPerDay(rangeData, maxItems = 5) {
  const rangeCondensedAvailability = Array.from(rangeData || [])
    .map(({ agents, day: utcDate, dayOfWeek, dayOfWeekOrd, dayOfYear, month }) => {
      let t = new Date(utcDate);
      const localDate = new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
      return {
        day: localDate,
        dayOfWeek,
        dayOfWeekOrd,
        dayOfYear,
        month,
        items: combineAgentSchedules(agents, maxItems),
      };
    });
  // console.log(rangeData, rangeCondensedAvailability);
  return rangeCondensedAvailability;
}

function combineAgentSchedules(agentSchedules, maxItems = 5) {
  let timeChunks = [];

  // Flatten all agent schedules into a single array of items
  const items = agentSchedules.flatMap(({ agent, hours }) =>
    hours.parsed.map(({ sta, fin }) => ({ sta, fin, agent, }))
  );

  // Sort items by start time, then by end time
  items.sort((a, b) => (a.sta !== b.sta) ? a.sta - b.sta : a.fin - b.fin);

  let lastEnd = 0;

  for (const { sta, fin, agent } of items) {
    // Add the current item as a separate time chunk
    const validStart = Math.max(sta, lastEnd + 1);
    const validDuration = Math.round((fin - validStart) / 10) * 10;
    if (validDuration > 0) {
      timeChunks.push({
        sta: validStart,
        fin,
        dur: validDuration,
        agent: agent,
      });
    }

    lastEnd = Math.max(lastEnd, fin);
  }

  if (maxItems) {
    timeChunks = [...timeChunks].sort(() => Math.random() - 0.5);
    timeChunks.splice(0, timeChunks.length - maxItems);
    timeChunks = [...timeChunks].sort((a, b) => (a.sta !== b.sta) ? a.sta - b.sta : a.fin - b.fin);
  }

  // console.log(items, timeChunks);

  return timeChunks;
}
