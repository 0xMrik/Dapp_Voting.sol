
import { Box, Heading, Text } from '@chakra-ui/react';

const VotingStart = () => {
  return (
    <Box maxW="700px" mx="auto" textAlign="center" p="4">
      <Heading as="h2" size="xl" mb="4">
        Voting Session Started !
      </Heading>
      <Text fontSize="lg">
        The voting session has started. Voters can now submit their vote. 
      </Text>
    </Box>
  );
};

export default VotingStart;