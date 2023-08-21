interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Administrator'],
  customerRoles: [],
  tenantRoles: ['Administrator', 'Vehicle Owner', 'Reservation Manager', 'Performance Analyst'],
  tenantName: 'Organization',
  applicationName: 'carsha',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
};
