import CardanoContext from '../providers/CardanoProvider';
import { CardanoContextType } from 'types/cardano.types';
import React from 'react';

const useCardano = () => {
  const context = React.useContext<CardanoContextType>(CardanoContext);
  return { ...context };
};

export default useCardano;
