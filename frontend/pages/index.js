import { useState } from "react";
import { connectWallet, submitScan, getResult } from "../lib/api";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [stored, setStored] = useState(null);

  function analyze() {
    let score = Math.floor(Math.random() * 100);
    let label = score > 70 ? "SAFE" : score > 40 ? "RISK" : "DANGER";
    return { score, label };
  }

  async function handleConnect() {
    const acc = await connectWallet();
    setAccount(acc);
  }

  async function handleScan() {
    const res = analyze();
    await submitScan(address, res.score, res.label, account);
    setResult(res);
  }

  async function handleFetch() {
    const res = await getResult(address, account);
    setStored(res);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>GhostLayer</h1>

      <button onClick={handleConnect}>
        {account ? "Connected" : "Connect Wallet"}
      </button>

      <input onChange={(e)=>setAddress(e.target.value)} placeholder="Contract Address"/>

      <button onClick={handleScan}>Scan</button>
      <button onClick={handleFetch}>Fetch</button>

      {result && <p>{result.label} ({result.score})</p>}
      {stored && <pre>{JSON.stringify(stored, null, 2)}</pre>}
    </div>
  );
}
