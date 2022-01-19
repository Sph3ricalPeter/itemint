import { ethers } from "ethers";
import Itemint from '../artifacts/contracts/Contract.sol/Itemint.json';
import { Button, Typography, Image } from "antd";
import { useEffect, useState } from "react";

import WalletBalance from "./WalletBalance";

const { Title } = Typography;

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, Itemint.abi, signer);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);

  useEffect(() => {
    getCount();
  }, []);
  

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  }

  return (
    <div>
      <WalletBalance/>

      <Title>Itemint NFT Collection</Title>
      {
        Array(totalMinted + 1)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <NFTImage tokenId={i} getCount={getCount}/>
            </div>
          ))
      }
    </div>
  );  
}

function NFTImage( {tokenId, getCount }) {
  const contentId = 'QmZ82ZGdNw3SWZ13cT3BH8uABnZUjyFwwBjfhtYGWDSddz'; // Pinata content id
  const metadataURI = `${contentId}/${tokenId}.json`;
  const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  // if not working, use local
  // const imageURI = `img/${tokenId}.png`;
  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther('0.05'),
    })

    await result.wait();
    getMintedStatus();
    getCount();
  }

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }

  return (
    <div>
      <Image width={200} src={isMinted ? imageURI : '../img/placeholder.png'}></Image>
      <div>
        <Title level={3}>ID #{tokenId}</Title>
        {!isMinted ? (
          <Button type="primary" onClick={mintToken}>Mint</Button>
        ) : (
          <Button type="secondary" onClick={getURI}>Taken! Show URI</Button>
        )}
      </div>
    </div>
  )
}

export default Home;
