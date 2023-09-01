interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['App Administrator'],
  customerRoles: ['Guest'],
  tenantRoles: ['Restaurant Owner', 'Delivery Driver', 'App Administrator'],
  tenantName: 'Organization',
  applicationName: 'foodie',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [
    'Manage orders',
    'Manage delivery address',
    'View available restaurants and their menus',
    'View status of orders',
  ],
  ownerAbilities: ['Manage Organizations', 'Invite Restaurant Owners and Delivery Drivers to join the platform'],
};
