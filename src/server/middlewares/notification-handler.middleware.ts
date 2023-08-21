import { getServerSession } from '@roq/nextjs';
import { NextApiRequest } from 'next';
import { NotificationService } from 'server/services/notification.service';
import { convertMethodToOperation, convertRouteToEntityUtil, HttpMethod, generateFilterByPathUtil } from 'server/utils';
import { prisma } from 'server/db';

interface NotificationConfigInterface {
  roles: string[];
  key: string;
  tenantPath: string[];
  userPath: string[];
}

const notificationMapping: Record<string, NotificationConfigInterface> = {
  'vehicle.update': {
    roles: ['administrator', 'vehicle-owner'],
    key: 'vehicle-update',
    tenantPath: ['organization', 'user', 'vehicle'],
    userPath: [],
  },
  'reservation.create': {
    roles: ['reservation-manager'],
    key: 'new-reservation',
    tenantPath: ['organization', 'user', 'reservation'],
    userPath: [],
  },
  'reservation.update': {
    roles: ['user', 'reservation-manager'],
    key: 'reservation-update',
    tenantPath: ['organization', 'user', 'reservation'],
    userPath: [],
  },
  'usage.create': {
    roles: ['vehicle-owner', 'performance-analyst'],
    key: 'vehicle-usage',
    tenantPath: ['organization', 'user', 'usage'],
    userPath: [],
  },
  'performance.update': {
    roles: ['performance-analyst'],
    key: 'performance-update',
    tenantPath: ['organization', 'user', 'performance'],
    userPath: [],
  },
};

const ownerRoles: string[] = ['administrator'];
const customerRoles: string[] = [];
const tenantRoles: string[] = ['administrator', 'vehicle-owner', 'reservation-manager', 'performance-analyst'];

const allTenantRoles = tenantRoles.concat(ownerRoles);
export async function notificationHandlerMiddleware(req: NextApiRequest, entityId: string) {
  const session = getServerSession(req);
  const { roqUserId } = session;
  // get the entity based on the request url
  let [mainPath] = req.url.split('?');
  mainPath = mainPath.trim().split('/').filter(Boolean)[1];
  const entity = convertRouteToEntityUtil(mainPath);
  // get the operation based on request method
  const operation = convertMethodToOperation(req.method as HttpMethod);
  const notificationConfig = notificationMapping[`${entity}.${operation}`];

  if (!notificationConfig || notificationConfig.roles.length === 0 || !notificationConfig.tenantPath?.length) {
    return;
  }

  const { tenantPath, key, roles, userPath } = notificationConfig;

  const tenant = await prisma.organization.findFirst({
    where: generateFilterByPathUtil(tenantPath, entityId),
  });

  if (!tenant) {
    return;
  }
  const sendToTenant = () => {
    console.log('sending notification to tenant', {
      notificationConfig,
      roqUserId,
      tenant,
    });
    return NotificationService.sendNotificationToRoles(key, roles, roqUserId, tenant.tenant_id);
  };
  const sendToCustomer = async () => {
    if (!userPath.length) {
      return;
    }
    const user = await prisma.user.findFirst({
      where: generateFilterByPathUtil(userPath, entityId),
    });
    console.log('sending notification to user', {
      notificationConfig,
      user,
    });
    await NotificationService.sendNotificationToUser(key, user.roq_user_id);
  };

  if (roles.every((role) => allTenantRoles.includes(role))) {
    // check if only  tenantRoles + ownerRoles
    await sendToTenant();
  } else if (roles.every((role) => customerRoles.includes(role))) {
    // check if only customer role
    await sendToCustomer();
  } else {
    // both company and user receives
    await Promise.all([sendToTenant(), sendToCustomer()]);
  }
}
