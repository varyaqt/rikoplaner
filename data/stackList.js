export let stackList = [
  {
    id: 1,
    name: 'Позвонить маме'
  },
  {
    id: 2,
    name: 'Помыть посуду'
  }
];

export function sortStackList() {
  if (stackList.length !== 0) {
    stackList.sort((a, b) => b.id - a.id);
  }
}

export function checkFullStack() {
  if (stackList.length < 10) {
    return false;
  }
  return true;
};

export function deleteTaskFromStackList(taskId) {
  stackList = stackList.filter(task => task.id !== taskId);
}