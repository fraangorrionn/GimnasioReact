import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function PagoView() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    const renderPayPalButton = () => {
      if (!window.paypal) return;

      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: '10.00' }
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            console.log("✅ Pago capturado correctamente en PayPal:", order);

            const response = await fetch(`${API_URL}/api/pagos/crear/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({})
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error("Error al registrar el pago en backend:", errorData);
              alert('El pago se realizó pero no se registró correctamente en el sistema.');
              return;
            }

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            const claseId = localStorage.getItem('clase_pago');
            localStorage.removeItem('clase_pago');
            localStorage.setItem('suscripcion_activada', 'true');

            alert('Pago completado y suscripción activada.');

            if (claseId) {
              navigate(`/clases/${claseId}`, { state: { suscripcion_activada: true } });
            } else {
              navigate('/inicio');
            }
          } catch (error) {
            console.error('Error durante el proceso de pago:', error);
            alert('Hubo un problema al procesar tu pago.');
          }
        },
        onError: err => {
          console.error('Error en PayPal:', err);
          alert('Error durante el pago con PayPal.');
        }
      }).render('#paypal-button-container');
    };

    const existingScript = document.getElementById('paypal-sdk');
    if (existingScript) {
      renderPayPalButton();
      return;
    }

    const paypalScript = document.createElement('script');
    paypalScript.id = 'paypal-sdk';
    paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=Acn6jV7_CdjYnStEy6mamEfGQqkzlBk4fRh0yyO5rUlw2PFQFt0pHlkaoo6ea7gqCjQ3wDaAhBeoVcYQ&currency=EUR&components=buttons';
    paypalScript.onload = renderPayPalButton;
    document.body.appendChild(paypalScript);
  }, [navigate, token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h2>Completa tu suscripción</h2>
      <div id="paypal-button-container" style={{ marginTop: '2rem' }}></div>
    </div>
  );
}

export default PagoView;
