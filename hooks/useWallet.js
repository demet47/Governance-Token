import { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import MyGov from "../artifacts/contracts/mygov.sol/MyGov.json";

const WalletContext = createContext({});

export const useWallet = () => useContext(WalletContext);

export default function WalletProvider({ children, contractAddress }) {
  const [contract, setContract] = useState(null);

  const [account, setAccount] = useState(null);

  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MyGov.abi, signer);
      var Web3 = require("web3");
      setContract(contract);
      try {
        let accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        let getBalance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        });
        let contractBalance = await window.ethereum.request({
          method: "eth_getBalance",
          params: ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "latest"],
        });
        const weiValue = Web3.utils.fromWei(getBalance.toString(), "ether");
        console.log(getBalance.toString());
        console.log("Contract Balance: " + contractBalance.toString());
        setBalance(weiValue);
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("Please install metamask !");
    }
  };

  useEffect(() => {
    if (
      typeof window.ethereum !== "undefined" &&
      window.ethereum.selectedAddress
    ) {
      connectWallet();
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        balance,
        contract,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
