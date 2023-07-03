import { Image } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Flex } from "@chakra-ui/react";

const Header = () => {
  return (
    <Flex
        p="2rem"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        h="15vh"
    >
        <Image src="./406508-PDEPF7-872.jpg" alt="Logo" width="200px" height="200px" />  
        <ConnectButton />
    </Flex>
  );
};

export default Header;