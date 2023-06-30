import { Box, Heading, Text } from '@chakra-ui/react';

const ProposalsRegistration = () => {
  return (
    <Box maxW="700px" mx="auto" textAlign="center" p="4">
      <Heading as="h2" size="xl" mb="4">
        Proposals Registration
      </Heading>
      <Text fontSize="lg">
        The proposals registration phase has started. Voters can now submit their proposals.
      </Text>
    </Box>
  );
};

export default ProposalsRegistration;