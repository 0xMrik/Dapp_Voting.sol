import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { useState, useEffect } from 'react';
import { Button, Input, VStack, Text, useToast, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const RegisterVoter = () => {
  const [address, setAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voters, setVoters] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const checkOwner = async () => {
      try {
        if (window.ethereum) {
          const [currentUser] = await window.ethereum.request({ method: 'eth_accounts' });

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, provider);
          const owner = await contract.owner();

          setIsOwner(currentUser.toLowerCase() === owner.toLowerCase());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchVoters = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, provider);

        const votersCount = await contract.getVotersCount();
        const voters = [];

        for (let i = 0; i < votersCount; i++) {
          const voter = await contract.getVoterByIndex(i);
          voters.push(voter);
        }

        setVoters(voters);
      }
    };

    checkOwner();
    fetchVoters();
  }, []);

  useEffect(() => {
    const savedVoters = JSON.parse(localStorage.getItem('voters'));
    if (savedVoters) {
      setVoters(savedVoters);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('voters', JSON.stringify(voters));
  }, [voters]);

  const registerVoter = async () => {
    try {
      if (!address) {
        toast({
          title: 'Erreur',
          description: 'Veuillez entrer une adresse avant de vous enregistrer comme votant.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, signer);
  
        const voter = await contract.getVoter(address);
  
        if (voter.isRegistered) {
          toast({
            title: 'Erreur',
            description: 'Cette adresse est déjà enregistrée comme votant.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } else {
          const transaction = await contract.addVoter(address);
          await transaction.wait();
  
          toast({
            title: 'Succès',
            description: `Votant ${address} enregistré.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          console.log(`Voter ${address} registered`);
  
          const updatedVoters = [...voters, { address }];
          setVoters(updatedVoters);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement du votant');
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!isOwner) {
    return <Text>You are not the owner of the contract</Text>;
  }

  return (
    <VStack spacing={4}>
      <Input placeholder="Enter voter address" value={address} onChange={e => setAddress(e.target.value)} maxWidth="700px" />
      <Button onClick={registerVoter}>Register Voter</Button>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Address</Th>
          </Tr>
        </Thead>
        <Tbody>
          {voters.map((voter, index) => (
            <Tr key={index}>
              <Td>{voter.address}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default RegisterVoter;