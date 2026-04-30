import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3Accounts, web3FromSource } from "@polkadot/extension-dapp";
import { ContractPromise } from "@polkadot/api-contract";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "PASTE_CONTRACT_ADDRESS";
const RPC = "PASTE_PORTALDOT_RPC";

let api;

export async function getApi() {
  if (!api) {
    const provider = new WsProvider(RPC);
    api = await ApiPromise.create({ provider });
  }
  return api;
}

export async function connectWallet() {
  await web3Enable("GhostLayer");
  const accounts = await web3Accounts();
  return accounts[0];
}

export async function submitScan(address, score, label, account) {
  const api = await getApi();
  const contract = new ContractPromise(api, abi, CONTRACT_ADDRESS);
  const injector = await web3FromSource(account.meta.source);

  await contract.tx.submitScan(
    { gasLimit: -1 },
    address,
    score,
    new TextEncoder().encode(label)
  ).signAndSend(account.address, { signer: injector.signer });
}

export async function getResult(address, account) {
  const api = await getApi();
  const contract = new ContractPromise(api, abi, CONTRACT_ADDRESS);

  const { output } = await contract.query.getResult(
    account.address,
    { gasLimit: -1 },
    address
  );

  return output?.toHuman();
}
