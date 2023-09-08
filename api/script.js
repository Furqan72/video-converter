document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const form = document.querySelector('form');

  const socket = io();

  form.addEventListener('submit', () => {
    loader.style.display = 'block';
  });

  socket.on('message', (message) => {
    if (message.includes('Conversion Finished')) {
      loader.style.display = 'none';
    }
  });
});
