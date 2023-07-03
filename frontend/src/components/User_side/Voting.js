import React, { useState, useEffect } from 'react';
import { Button, VStack, useToast } from '@chakra-ui/react';
import { useContract } from '../../hooks/useContract';

const Voting = () => {
    const { contract, error } = useContract();
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
            } else if (contract) {
                const transaction = await contract.vote(proposalId);
                await transaction.wait();
                toast({
                    title: 'Succès',
                    description: `Vous avez voté pour la proposition ${proposalId}.`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setProposalId(''); // Clear the input field
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
