import '../../styles/creditCard.css';

interface CardData {
  tarjetaNumero: string;
  nombre: string;
  añoVencimiento: string;
  mesVencimiento: string;
  cvv: string;
}

interface CreditProps {
  data: CardData;       
  isFlipped: boolean;
}

const CreditCard = ({ data, isFlipped }: CreditProps) => {
  
  // Lógica para detectar la marca de la tarjeta
  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    return 'default';
  };

  const brand = getCardBrand(data.tarjetaNumero || "");

  const formatCardNumber = (number: string) => {
    return number ? number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() : "#### #### #### ####";
  };

  return (
    <div className={`visual-card-container ${isFlipped ? 'is-flipped' : ''}`}>
      <div className="card-inner">
        
        {/* FRENTE */}
        <div className="card-front">
          <div className="border-glow"></div>
          
          <div className="card-content"> 
            <div className="card-chip"></div>
            
            {/* LOGO CONDICIONAL */}
            <div className={`card-brand brand-${brand}`}>
              {brand === 'visa' && <span>VISA</span>}
              
              {brand === 'mastercard' && (
                <div className="master-circles">
                  <div className="circle-red"></div>
                  <div className="circle-orange"></div>
                </div>
              )}
              
              {brand === 'amex' && (
                <div className="amex-box">
                  <span>AMEX</span>
                </div>
              )}

              {brand === 'default' && <span className="default-label">CARD</span>}
            </div>
            
            <div className="card-number-display">
              {formatCardNumber(data.tarjetaNumero)}
            </div>
            
            <div className="card-bottom-row">
              <div className="card-holder">
                <span className="card-label">Titular</span>
                <div className="card-value">{data.nombre.toUpperCase() || "NOMBRE APELLIDO"}</div>
              </div>
              <div className="card-expiration">
                <span className="card-label">Vence</span>
                <div className="card-value">
                  {data.mesVencimiento || "MM"}/{data.añoVencimiento || "YY"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVERSO */}
        <div className="card-back">
          <div className="border-glow"></div>
          
          <div className="card-content">
            <div className="magnetic-bar"></div>
            <div className="cvv-section">
              <span className="card-label">CVV</span>
              <div className="cvv-white-bar">
                {data.cvv || "•••"}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CreditCard;