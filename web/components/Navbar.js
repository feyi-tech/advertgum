import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Heading,
  Spacer,
  useDisclosure,
  IconButton,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ children, href }) => (
  <Link
    as={NextLink}
    href={href}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{ textDecoration: 'none', bg: 'brand.700' }}
    color="white"
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg={'brand.800'} px={4} shadow="md">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <NextLink href="/" passHref>
          <Heading size="md" color="white">AdvertGum</Heading>
        </NextLink>

        <HStack spacing={8} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
          <NavLink href="/#featured">Featured Ads</NavLink>
          <NavLink href="/advertisers">For Advertisers</NavLink>
        </HStack>

        <Spacer />

        <Flex alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
          {user ? (
            <>
              <NextLink href="/dashboard" passHref>
                <Button variant="ghost" color="white" _hover={{ bg: 'brand.700' }}>Dashboard</Button>
              </NextLink>
              <NextLink href="/dashboard/wallet" passHref>
                <Button variant="ghost" color="white" _hover={{ bg: 'brand.700' }}>Wallet</Button>
              </NextLink>
              <NextLink href="/dashboard/create-ad" passHref>
                <Button colorScheme="teal" ml={2}>Create Ad</Button>
              </NextLink>
              <Button onClick={logout} ml={4} variant="outline" borderColor="brand.600" color="white" _hover={{ bg: 'brand.700' }}>Logout</Button>
            </>
          ) : (
             <NextLink href="/login" passHref>
                <Button colorScheme="teal">Login / Register</Button>
             </NextLink>
          )}
        </Flex>

        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
          bg="transparent"
          color="white"
          _hover={{ bg: 'brand.700' }}
        />
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <VStack as={'nav'} spacing={4}>
            <NavLink href="/#featured">Featured Ads</NavLink>
            <NavLink href="/advertisers">For Advertisers</NavLink>
            {user && <NavLink href="/dashboard">Dashboard</NavLink>}
            {user && <NavLink href="/dashboard/wallet">Wallet</NavLink>}
          </VStack>
        </Box>
      ) : null}
    </Box>
  );
}
