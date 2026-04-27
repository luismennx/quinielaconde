const recoveryForm = document.getElementById('recoveryForm');

recoveryForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(recoveryForm);
  const recoveryValue = formData.get('recoveryValue')?.toString().trim();

  if (!recoveryValue) {
    alert('Por favor ingresa tu correo, apodo o WhatsApp.');
    return;
  }

  try {
    console.log('Dato listo para recuperación:', recoveryValue);
    alert('Pantalla de recuperación lista. El siguiente paso será conectarla al backend.');
    recoveryForm.reset();
  } catch (error) {
    console.error('Error en recuperación:', error);
    alert('Ocurrió un error al procesar la recuperación.');
  }
});
