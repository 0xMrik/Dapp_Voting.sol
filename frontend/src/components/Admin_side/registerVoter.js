import { useState, useEffect } from 'react';
import { Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useContract } from '../../hooks/useContract';
import { ethers } from 'ethers';

const RegisterVoter = () => {
  const { contract, error } = useContract();
  const [address, setAddress] = useState('');
  const toast = useToast();
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
    } else {
      setError('Ethereum provider not found');
    }
  }, []);

  const registerVoter = async () => {
    try {
      if (contract && signer) {
        const updatedContract = contract.connect(signer);
        const transaction = await updatedContract.addVoter(address);
        await transaction.wait();
        toast({
          title: 'Success',
          description: `Voter ${address} registered successfully.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'An error occurred while registering the voter.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!contract) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <VStack spacing={4}>
      <Input
        placeholder="Enter voter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        maxWidth="700px"
      />
      <Button onClick={registerVoter}>Register Voter</Button>
    </VStack>
  );
};

export default RegisterVoter;