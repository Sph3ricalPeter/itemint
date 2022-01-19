import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Typography } from 'antd';

const { Title } = Typography;

function WalletBalance() {
  const [balance, setBalance] = useState();

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.utils.formatEther(balance));
  }

  return (
    <div className="card">
      <div>
        <Title level={3}>Your Balance: {balance}</Title>
        <Button type="primary" onClick={() => getBalance()}>Show My Balance</Button>
      </div>
    </div>
  )
}

export default WalletBalance;
