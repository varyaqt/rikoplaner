new AirDatepicker('#airdatepicker', {
  inline: true
});

const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1; 
const year = today.getFullYear();
const formattedDate = `${day}.${month}.${year}`;

const calendarInputElement = document.getElementById('airdatepicker');
calendarInputElement.value = `${formattedDate}`;

