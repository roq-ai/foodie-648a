const mapping: Record<string, string> = {
  deliveries: 'delivery',
  menus: 'menu',
  orders: 'order',
  'order-items': 'order_item',
  organizations: 'organization',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
