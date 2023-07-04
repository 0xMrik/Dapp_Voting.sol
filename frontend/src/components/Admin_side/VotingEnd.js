
import { Box, Heading, Text } from '@chakra-ui/react';

const VotingEnd = () => {
  return (
    <Box maxW="700px" mx="auto" textAlign="center" p="4">
      <Heading as="h2" size="xl" mb="4">
        Voting Session Ended !
      </Heading>
      <Text fontSize="lg">
        The voting session has ended. Voters are no longer able to vote.
      </Text>
    </Box>
  );
};

export default VotingEnd;