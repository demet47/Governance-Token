const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account:", deployer.address);
  const MyGov = await hre.ethers.getContractFactory("MyGov");
  const mygov = await MyGov.deploy("10000000000000000");
  await mygov.deployed();
  console.log("Contract deployed at:", mygov.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
