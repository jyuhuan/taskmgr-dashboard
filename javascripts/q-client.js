const server = 'http://localhost:3000';

const Q = {};
Q.allTasks = () => $.getJSON(`${server}/tasks`);
Q.totalTaskCount = () => $.getJSON(`${server}/tasks/count`);
Q.getTaskById = (id) => $.getJSON(`${server}/tasks/${id}`);

Q.exists = (id) => $.getJSON(`${server}/tasks/`);
// Q.nameOf = 
// Q.descriptionOf = 
Q.progressOf = (id) => $.getJSON(`${server}/tasks/${id}/progress`);
// Q.propOf = 
// Q.setNameOf = 
// Q.setDescriptionOf = 
// Q.setProgressOf = 
// Q.setPropOfQ. = 