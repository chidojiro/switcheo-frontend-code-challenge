interface WalletBalance {
  currency: string;
  amount: number;
}

// INEFFICIENCY: unnecessary interface
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
}

interface Props extends BoxProps {

}

// ANTI PATTERN: either declare props in React.FC or in function signature
const WalletPage: React.FC<Props> = (props: Props) => {
  // ANTI PATTERN: restProps is a clearer name than rest
  // ANTI PATTERN: should directly destructuring props in the function parameters
  const { children, ...rest } = props;
  const balances = useWalletBalances();

  // ANTI PATTERN: missing type for prices state
	const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {
      // INEFFICIENCY: console.err is not a function (should be console.error)
      console.err(error);
    });
  }, []);

  // INEFFICIENCY: pure function should be declared outside of component
  // ANTI PATTERN: any type should be avoided
	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      // INEFFICIENCY: lhsPriority is not defined (should be balancePriority)
		  if (lhsPriority > -99) {
        // INEFFICIENCY: incorrect condition (should be balance.amount > 0)
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);

      // INEFFICIENCY: this condition results in a sort that is always ascending, and is also verbose
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
    // INEFFICIENCY: unnecessary `prices` dependency
  }, [balances, prices]);

  // INEFFICIENCY: unnecessary transformation
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        // ANTI PATTERN: index is used as key
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        // INEFFICIENCY: missing format (balance.amount.toFixed())
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}