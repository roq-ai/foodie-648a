import AppLayout from 'layout/app-layout';
import { requireNextAuth, useSession } from '@roq/nextjs';
import { Flex, Text, Box, Card, Grid, Button, Stack, Avatar, SkeletonText, Spinner } from '@chakra-ui/react';
import { CalendarDashboardIcon } from 'icons/calendar-dashboard-icon';
import { IncreaseIcon } from 'icons/increase-icon';
import { DecreaseIcon } from 'icons/decrease-icon';
import useSWR from 'swr';
import { PaginatedInterface } from 'interfaces';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import NextLink from 'next/link';
import { appConfig } from 'config';
import * as inflection from 'inflection';
import { useGraphqlQuery } from 'lib/hooks/use-graphql-query';
import format from 'date-fns/format';
import { FULL_DATE_FORMAT } from 'const/date-format';
import { getOrders } from 'apiSdk/orders';
import { OrderInterface } from 'interfaces/order';
import { getOrderItems } from 'apiSdk/order-items';
import { OrderItemInterface } from 'interfaces/order-item';
import { getMenus } from 'apiSdk/menus';
import { MenuInterface } from 'interfaces/menu';

import { OrderItemListPage as ShowCaseList } from 'pages/order-items';

function DashboardPage() {
  const { session } = useSession();

  const orderStat = useSWR<PaginatedInterface<OrderInterface>>(
    () => `/orders`,
    () => getOrders({ limit: 1, offset: 0 }),
  );

  const orderItemStat = useSWR<PaginatedInterface<OrderItemInterface>>(
    () => `/order-items`,
    () => getOrderItems({ limit: 1, offset: 0 }),
  );

  const menuStat = useSWR<PaginatedInterface<MenuInterface>>(
    () => `/menus`,
    () => getMenus({ limit: 1, offset: 0 }),
  );

  const statResults: { title: string; result: number; change: number; isLoading: boolean }[] = [
    {
      title: 'Orders',
      result: orderStat?.data?.totalCount,
      isLoading: orderStat.isLoading,
      change: Math.floor(Math.random() * (100 - 40 + 1) + 40),
    },
    {
      title: 'Order Items',
      result: orderItemStat?.data?.totalCount,
      isLoading: orderItemStat.isLoading,
      change: Math.floor(Math.random() * (100 - 40 + 1) + 40),
    },
    {
      title: 'Menus',
      result: menuStat?.data?.totalCount,
      isLoading: menuStat.isLoading,
      change: Math.floor(Math.random() * (100 - 40 + 1) + 40),
    },
  ].filter((e) => (e.isLoading ? true : !Number.isNaN(e.result)));

  const { data, isLoading: allUsersLoading } = useGraphqlQuery({
    query: `
        query AllUsers($tenantId: ID!){
          userProfiles(filter: { tenantId: { equalTo: $tenantId } }) {
            data {
              id
              firstName
              lastName
              avatarUrl
              email
            }
          }
        }
      `,
    variables: {
      tenantId: session?.user?.tenantId,
    },
  });
  const allUsers: PaginatedInterface<any> = data?.userProfiles;
  return (
    <AppLayout>
      <Flex
        mb="7"
        alignItems={{ base: 'flex-start' }}
        justifyContent={{ base: 'center', md: 'space-between' }}
        direction={{ base: 'column-reverse', md: 'row' }}
      >
        <Flex direction="column">
          <Text fontSize="3xl" as="b" color="base.content">
            Hello {session.user?.email} 👋
          </Text>
          <Text opacity={0.6} fontSize="md" color="base.content">
            This is how your dashboard could look like
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <CalendarDashboardIcon />
          <Text fontSize="md" opacity={0.6} as="b" color="base.content">
            {format(new Date(), FULL_DATE_FORMAT)}
          </Text>
        </Flex>
      </Flex>
      <Box>
        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <Stack direction="column" spacing={8} flex={{ base: 1, md: 7 }}>
            <Box>
              <Box mb={4}>
                <Text color="base.content" as="b" fontSize="xl">
                  Stats
                </Text>
              </Box>
              <Grid templateColumns="repeat(3, 1fr)" gap={{ base: 3, md: 6 }}>
                {statResults.map((stat, i) => (
                  <Box border="1px" borderColor={'base.300'} borderRadius="10px" key={i} p={{ base: 3, md: '18px' }}>
                    <Flex direction="column">
                      <Text fontSize="sm">{stat.title}</Text>
                      {stat.isLoading ? (
                        <>
                          <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="4" />
                        </>
                      ) : (
                        <>
                          <Text fontWeight={600} fontSize="2xl">
                            {stat.result}
                          </Text>
                          <Flex alignItems="center" gap={2.5}>
                            <IncreaseIcon height={'20px'} width={'20px'} color="state.success.main" />
                            <Text fontSize="xs">{stat.change}%</Text>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </Box>

            <Box>
              <Flex mb={4} justifyContent={'space-between'}>
                <Text as="b" fontSize="xl">
                  Latest Order Items
                </Text>
                <NextLink href={`order-items`} passHref legacyBehavior>
                  <Button
                    bg="neutral.transparent"
                    color="neutral.main"
                    type="button"
                    display="flex"
                    padding="0rem 0.5rem"
                    height="24px"
                    justifyContent="center"
                    alignItems="center"
                    fontSize="xs"
                    _hover={{
                      bg: 'neutral.transparent',
                      color: 'neutral.main',
                    }}
                  >
                    See all Order Items
                  </Button>
                </NextLink>
              </Flex>
              <Box borderRadius="12px" border="1px" borderColor={'base.300'} p={3}>
                <ShowCaseList
                  hidePagination={true}
                  hideTableBorders={true}
                  showSearchFilter={false}
                  hideActions
                  tableOnly
                  pageSize={5}
                />
              </Box>
            </Box>
          </Stack>
          <Stack direction="column" spacing={6} flex={{ base: 1, md: 3 }}>
            {!appConfig.customerRoles.includes(inflection.humanize(session?.user?.roles[0].replace(/-/g, ' '))) && (
              <Box>
                <Flex mb={4} justifyContent={'space-between'}>
                  <Text as="b" fontSize="xl">
                    All Users
                  </Text>
                  <NextLink href="/users" passHref legacyBehavior>
                    <Button
                      bg="neutral.transparent"
                      color="neutral.main"
                      type="button"
                      display="flex"
                      padding="0rem 0.5rem"
                      height="24px"
                      justifyContent="center"
                      alignItems="center"
                      fontSize="xs"
                      _hover={{
                        bg: 'neutral.transparent',
                        color: 'neutral.main',
                      }}
                    >
                      See all users
                    </Button>
                  </NextLink>
                </Flex>
                <Stack direction="column" spacing={3}>
                  {allUsersLoading && (
                    <Box display="flex" justifyContent="center">
                      <Spinner size="sm" color="blue.600" mr={2} />
                    </Box>
                  )}
                  {allUsers?.data.map((user) => (
                    <Box border="1px" borderColor={'base.300'} borderRadius="lg" p="3" key={user.id}>
                      <Flex alignItems="center" gap={3}>
                        <Avatar src={user.avatarUrl || null} w={8} h={8} />
                        <Flex direction="column">
                          <Text fontSize="sm" fontWeight={600}>
                            {[user.firstName, user.lastName].filter(Boolean).join(' ') || '-'}
                          </Text>
                          <Text fontSize="xs" fontWeight={400}>
                            {user.email}
                          </Text>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
            <Box>
              <Flex mb={4} justifyContent={'space-between'}>
                <Text as="b" fontSize="xl">
                  Current User
                </Text>
              </Flex>
              <Stack direction="column" spacing={3}>
                <Box border="1px" borderColor={'base.300'} borderRadius="lg" p="3">
                  <Flex alignItems="center" gap={3}>
                    <Avatar w={8} h={8} />
                    <Flex direction="column">
                      <Text fontSize="sm" fontWeight={600}>
                        {[session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' ') || '-'}
                      </Text>
                      <Text fontSize="xs" fontWeight={400}>
                        {session.user?.email}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </Box>
    </AppLayout>
  );
}

export default requireNextAuth({
  redirectIfAuthenticated: false,
  redirectTo: '/',
})(DashboardPage);
