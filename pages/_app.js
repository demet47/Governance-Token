import "bootstrap/dist/css/bootstrap.css";
import WalletProvider from "../hooks/useWallet";
//BLOX
//const contractAddress = "0x1275D096B9DBf2347bD2a131Fb6BDaB0B4882487";

//LOCAL
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function MyApp({ Component, pageProps }) {
  return (
    <WalletProvider contractAddress={contractAddress}>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default MyApp;
