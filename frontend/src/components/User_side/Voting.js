import React, { useState } from 'react';
import { Button, Input, VStack, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import VotingContract from '../../../../backend/artifacts/contracts/Voting.sol/Voting.json';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const Voting = () => {
    const [proposalId, setProposalId] = useState('');
    const toast = useToast();

    const vote = async () => {
        try {
            if (!proposalId) {
                toast({
                    title: 'Erreur',
                    description: 'Veuillez entrer l\'ID de la proposition pour laquelle vous voulez voter.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            } else if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingContract.abi, signer);
                const transaction = await contract.setVote(proposalId);
                await transaction.wait();
                toast({
                    title: 'Succès',
                    description: `Vous avez voté pour la proposition ${proposalId}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setProposalId(''); 
            }
        } catch (err) {
            console.error(err);
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de votre vote.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <VStack>
            <Input
                placeholder="Entrez l'ID de la proposition pour laquelle vous voulez voter..."
                value={proposalId}
                onChange={e => setProposalId(e.target.value)}
            />
            <Button onClick={vote}>Voter</Button>
        </VStack>
    );
};

export default Voting;