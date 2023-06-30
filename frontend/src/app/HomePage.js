import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import VotingContract from '../../../backend/artifacts/contracts/Voting.sol/Voting.json';
import { Box, Button, Heading, VStack, Spinner, Text, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';


const HomePage = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        if (window.ethereum) {
          const [address] = await window.ethereum.request({ method: 'eth_accounts' });
          setUserAddress(address);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', VotingContract.abi, provider);
          const owner = await contract.owner();
          
          setIsOwner(address.toLowerCase() === owner.toLowerCase());
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkOwner();
  }, []);

  return (
    <VStack spacing={8} align="center">
      <Heading as="h1" size="2xl">
        Bienvenue sur notre plateforme de vote
      </Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Box p={4} color="red.500">
          {error}
        </Box>
      ) : userAddress ? (
        <>
          <Text>Bonjour, {userAddress}!</Text>
          {isOwner ? (
            <>
              <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">Vous êtes le propriétaire!</AlertTitle>
              </Alert>
              <Link href="/admin" passHref>
                <Button colorScheme="teal" size="lg">
                  Aller à la page d'administration
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Alert status="info" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">Vous êtes un votant!</AlertTitle>
              </Alert>
              <Link href="/User" passHref>
                <Button colorScheme="blue" size="lg">
                  Aller à la page de vote
                </Button>
              </Link>
            </>
          )}
        </>
      ) : (
        <Text>Veuillez vous connecter pour continuer.</Text>
      )}
    </VStack>
  );
};

export default HomePage;