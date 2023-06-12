//  const fetch = require('node-fetch');

const consultaInput = document.getElementById('input');
const resultadosDiv = document.getElementById('resultadosDiv');

consultaInput.addEventListener('input', () => {
  const consulta = consultaInput.value;

  fetch('http://localhost:5000/inicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ consulta })
  })
    .then(response => response.json())
    .then(data => {
      // Manipular los resultados obtenidos
      resultadosDiv.innerHTML = JSON.stringify(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
