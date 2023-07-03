import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../backend/artifacts/contracts/Voting.sol/Voting.json';

export function useContract() {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        VotingContract.abi,
        provider
      );
      setContract(contract);
    } else {
      setError('Ethereum provider not found');
    }
  }, []);

  return { contract, error };
}