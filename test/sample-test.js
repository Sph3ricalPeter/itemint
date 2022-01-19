const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Contract", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const Itemint = await ethers.getContractFactory("Itemint");
    const itemint = await Itemint.deploy();
    await itemint.deployed();

    const recipient = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
    const metadataURI = "cid/test.png";

    let balance = await itemint.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await itemint.payToMint(recipient, metadataURI, {
      value: ethers.utils.parseEther("0.05")
    });

    await newlyMintedToken.wait();

    balance = await itemint.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await itemint.isContentOwned(metadataURI)).to.equal(true);
  });
});
