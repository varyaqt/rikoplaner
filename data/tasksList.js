export let tasksList = [
  {
    id: 1,
    title: 'Помыть посуду',
    date: new Date(),
    is_done: false
  },
  {
    id: 2,
    title: 'Сделать домашку',
    date: today,
    is_done: false
  },
  {
    id: 3,
    title: 'Помыть посуду',
    date: today.setDate(today.getDate() + 45),
    is_done: false
  }
];

const today = new Date();