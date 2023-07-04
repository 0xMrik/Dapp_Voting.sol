import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingContract from '../../../backend/artifacts/contracts/Voting.sol/Voting.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export function useContract() {
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VotingContract.abi,
        provider
      );
      setContract(contract);
    } else {
      setError('Ethereum provider not found');
    }
  }, []);

  return { contract, error, setError }; 
}