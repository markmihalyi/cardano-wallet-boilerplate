import React from 'react';
import useCardano from '@/common/hooks/useCardano';

type Props = {
  name: string;
  id: string;
  icon: string;
};

const WalletRadioButton: React.FC<Props> = ({ name, id, icon }) => {
  const { handleWalletSelect } = useCardano();

  return (
    <label style={{ display: 'flex', alignItems: 'center' }}>
      <input type="radio" id={id} name="wallet" value={id} onChange={handleWalletSelect} />
      <img src={icon} width={24} height={24} alt={id} />
      {name} ({id})
    </label>
  );
};

export default WalletRadioButton;
