const TaskUtils = {
  progressStr: (t) => Math.floor(t.steps * 100 / t.max),
  hasDescription: (t) => t.description ? t.description !== '' : false,
  isDone: (t) => t.steps >= t.max
};

const idExists = (domId) => ($(domId).length > 0)

const refresh = () => {
  // Check for new tasks or deleted tasks
  Q.allTasks().done(res => {
    const taskIdSet = new Set(res.data.map(t => t.id));

    // Remove deleted tasks
    Array.from($('#lstOpenTasks').children()).concat(Array.from($('#lstClosedTasks').children())).forEach(x => {
      const id = parseInt(x.id.substring(8));
      if (!taskIdSet.has(id)) x.remove();
    });

    res.data.forEach(t => {
      // Is this a new task?
      if (!idExists(`#taskItem${t.id}`)) {
        const taskItem = `
          <div id="taskItem${t.id}" class="Task">
            <div class="Indicator">
              <svg height="40" width="40">
                <circle cx="20" cy="20" r="19" stroke-width="1" fill="transparent"></circle>
                <text class="TaskProgressDigit" id="taskProgress${t.id}" x="20" y="20" text-anchor="middle" alignment-baseline="central" font-size="20px">${TaskUtils.progressStr(t)}</text>
              </svg>
            </div>
            <div class="Info">
              <div class="Name">${t.name}</div>
              <div class="Description">${TaskUtils.hasDescription(t) ? t.description : '(No description)'}</div>
              <div class="ConsolePeek">This will be the last line of primary output</div>
            </div>
            <div id="btnDelete${t.id}" class="ActionButton">删</div>
          </div>
        `
        // Determin whether it is done, and put it in the right sublist.
        if (TaskUtils.isDone(t)) $('#lstClosedTasks').prepend(taskItem); else $('#lstOpenTasks').prepend(taskItem);

        $(`#btnDelete${t.id}`).on('click', function (e) {
          Q.delete(t.id, () => $(`#taskItem${t.id}`).remove());
        });

      }

      // Update progress
      $(`#taskProgress${t.id}`).text(TaskUtils.progressStr(t));

      // Put in the right sublist
      if (TaskUtils.isDone(t)) {
        // Make sure it is under "Closed Tasks"
        if ($(`#taskItem${t.id}`).parent().is('#lstOpenTasks')) {
          $(`#taskItem${t.id}`).detach().prependTo('#lstClosedTasks');
        }
      }
      else {
        // Make sure it is under "Open Tasks"
        if ($(`#taskItem${t.id}`).parent().is('#lstClosedTasks')) {
          $(`#taskItem${t.id}`).detach().prependTo('#lstOpenTasks');
        }
      }

      // Update task counts
      $('#txtOpenTaskCount').text($('#lstOpenTasks').children().length);
      $('#txtClosedTaskCount').text($('#lstClosedTasks').children().length);
    });
  });
}


$(() => {
  console.log('jQuery ready! ');

  refresh();
  setInterval(refresh, 1000);
});
