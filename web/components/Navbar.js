import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  useColorModeValue,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ children, href }) => (
  <Link
    as={NextLink}
    href={href}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('brand.700', 'brand.600'),
    }}
    color="white"
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Box bg={useColorModeValue('brand.800', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={8} alignItems={'center'}>
          <NextLink href="/" passHref>
            <Heading size="md" color="white">AdvertGum</Heading>
          </NextLink>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            <NavLink href="/#featured">Featured Ads</NavLink>
            <NavLink href="/advertisers">For Advertisers</NavLink>
          </HStack>
        </HStack>
        <Spacer />
        <Flex alignItems={'center'}>
          {user ? (
            <>
              <NextLink href="/dashboard" passHref>
                <Button colorScheme="brand" variant="ghost">Dashboard</Button>
              </NextLink>
               <NextLink href="/dashboard/wallet" passHref>
                <Button colorScheme="brand" variant="ghost">Wallet</Button>
              </NextLink>
              <NextLink href="/dashboard/create-ad" passHref>
                <Button colorScheme="brand">Create Ad</Button>
              </NextLink>
              <Button onClick={logout} ml={4}>Logout</Button>
            </>
          ) : (
             <NextLink href="/dashboard" passHref>
                <Button colorScheme="brand">Login / Register</Button>
             </NextLink>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
