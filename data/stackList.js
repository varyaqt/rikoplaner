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

sortStackList();
// console.log(typeof Number(stackList[0].id));

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