interface WalletBalance {
  id: string;
  currency: string;
  amount: number;
  blockchain: string;
}

class Datasource {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<Record<string, number>> {
    const response = await fetch(this.url);

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error);
    }
    
    return response.json();
  }
}

interface PriceMap extends Record<string, number> {
}

interface Props extends BoxProps {
}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
}

const WalletPage: React.FC<Props> = ({ children, ...restProps }) => {
  const balances = useWalletBalances(); // Assuming useWalletBalances is a custom hook that returns WalletBalance[]

  const [prices, setPrices] = useState<PriceMap>({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");

    datasource.getPrices().then(setPrices).catch(console.error);
  }, []);

  const sortedBalances = useMemo(() => {
    return balances
      .filter(balance => {
        const balancePriority = getPriority(balance.blockchain);

        return balance.amount > 0 && balancePriority > -99;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);

        return rightPriority - leftPriority;
      });
  }, [balances]);

  const rows = sortedBalances.map((balance: WalletBalance) => {
    const usdValue = prices[balance.currency] * balance.amount;

    return (
      // Assuming WalletRow is wrapped with React.memo
      <WalletRow 
        // Assuming classes is a declared CSS module
        className={classes.row}
        key={balance.id}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()}
      />
    );
  });

  return (
    <div {...restProps}>
      {rows}
    </div>
  );
}
