"use server";

import * as securityApi from "../api/security.api";

// security overview actions
export async function getSecurityOverviewAction() {
  return securityApi.fetchSecurityOverview();
}

// locked accounts actions
export async function getLockedAccountsAction() {
  return securityApi.fetchLockedAccounts();
}

// failed login logs
export async function getFailedLoginLogsAction(
  filters?: Parameters<typeof securityApi.fetchFailedLoginLogs>[0],
) {
  return securityApi.fetchFailedLoginLogs(filters);
}

// unlock account
export async function unlockAccountAction(userId: number) {
  return securityApi.unlockAccount(userId);
}
