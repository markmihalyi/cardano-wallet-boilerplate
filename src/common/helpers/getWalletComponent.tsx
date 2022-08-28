import WalletRadioButton from '@/components/WalletRadioButton';

export const getWalletComponent = (key: string) => {
  /**
   * You can allow or disallow specified wallets to be selected.
   
   * All wallets are allowed as long as the whitelist is empty.
   * If not, only the whitelisted wallets are allowed.
   */
  const whitelist: String[] = [];

  /** For example, you can disallow the "ccvault" wallet. */
  const blacklist: String[] = ['ccvault'];

  let name: string = window.cardano[key].name;
  let formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  if (whitelist.length === 0 || whitelist.includes(key)) {
    if (blacklist.includes(key)) {
      return null;
    }
    return (
      <WalletRadioButton key={key} name={formattedName} id={key} icon={window.cardano[key].icon} />
    );
  }
  return null;
};
