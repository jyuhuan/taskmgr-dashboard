const TaskUtils = {
  progressStr: (t) => Math.floor(t.steps * 100 / t.max),
  hasDescription: (t) => t.description ? t.description !== '' : false,
  isDone: (t) => t.steps >= t.max
};

const idExists = (domId) => ($(domId).length > 0)

/**
 * Converts a task object into div.Task
 * @param {*} task 
 */
const makeTaskItem = (task) => `<div id="taskItem${task.id}" class="Task">
      <div class="Indicator">
        <svg height="40" width="40">
          <circle cx="20" cy="20" r="19" stroke-width="1" fill="transparent"></circle>
          <text class="TaskProgressDigit" id="taskProgress${task.id}" x="20" y="20" text-anchor="middle" alignment-baseline="central" font-size="20px">${TaskUtils.progressStr(task)}</text>
        </svg>
      </div>
      <div class="Info">
        <div class="Name">${task.name}</div>
        <div class="Description">${TaskUtils.hasDescription(task) ? task.description : '(No description)'}</div>
        <div class="ConsolePeek">This will be the last line of primary output</div>
      </div>
    </div>`



const refresh = () => {
  // Check for new tasks or deleted tasks
  Q.allTasks().done(res => {
    res.data.forEach(t => {
      // Is this a new task?
      if (!idExists(`#taskItem${t.id}`)) {
        const taskItem = makeTaskItem(t);
        // Determin whether it is done, and put it in the right sublist.
        if (TaskUtils.isDone(t)) $('#lstClosedTasks').prepend(taskItem); else $('#lstOpenTasks').prepend(taskItem);
      }

      // Update progress
      $(`#taskProgress${t.id}`).text(TaskUtils.progressStr(t));

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


    });
  });
}


$(() => {
  console.log('jQuery ready! ');

  refresh();
  setInterval(refresh, 1000);
});
