import { useState, useEffect } from 'react';
import { Button, Input, VStack, Text, useToast, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import {useContract} from '../../hooks/useContract';

const RegisterVoter = () => {
  const { contract, error } = useContract();
  const [address, setAddress] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [voters, setVoters] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const checkOwner = async () => {
      try {
        if (contract) {
          const [currentUser] = await window.ethereum.request({ method: 'eth_accounts' });
          const owner = await contract.owner();
          setIsOwner(currentUser.toLowerCase() === owner.toLowerCase());
        }
      } catch (err) {
        setError(err.message);
      }
    };
    checkOwner();
  }, [contract]);

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
      } else if (contract) {
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
          const signer = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const updatedContract = contract.connect(signer[0]);
          const transaction = await updatedContract.addVoter(address);
          await transaction.wait();
          toast({
            title: 'Succès',
            description: `Votant ${address} enregistré.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          const updatedVoters = [...voters, { address }];
          setVoters(updatedVoters);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l\'enregistrement du votant');
    }
  };

  if (!contract) {
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