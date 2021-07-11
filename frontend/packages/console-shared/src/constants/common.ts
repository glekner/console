export const CONST = Object.freeze({
  // http://kubernetes.io/docs/user-guide/images/#bypassing-kubectl-create-secrets
  PULL_SECRET_TYPE: 'kubernetes.io/dockerconfigjson',
  PULL_SECRET_DATA: '.dockerconfigjson',
});

export const ANNOTATIONS = Object.freeze({
  displayName: 'openshift.io/display-name',
  providerDisplayName: 'openshift.io/provider-display-name',
  documentationURL: 'openshift.io/documentation-url',
  supportURL: 'openshift.io/support-url',
});

// Common shortcuts than span pages.
export const KEYBOARD_SHORTCUTS = Object.freeze({
  focusFilterInput: '/',
  blurFilterInput: 'Escape',
  focusNamespaceDropdown: 'n',
});

export const RESOURCE_NAME_TRUNCATE_LENGTH = 13;

// Use a key for the "all" namespaces option that would be an invalid namespace name to avoid a potential clash
export const ALL_NAMESPACES_KEY = '#ALL_NS#';

// Use a key for the "all" applications option that would be an invalid application name to avoid a potential clash
export const ALL_APPLICATIONS_KEY = '#ALL_APPS#';
export const UNASSIGNED_APPLICATIONS_KEY = '#UNASSIGNED_APP#';

// Prefix our localStorage items to avoid conflicts if another app ever runs on the same domain.
export const STORAGE_PREFIX = 'bridge';

export const USERSETTINGS_PREFIX = 'console';

// This localStorage key predates the storage prefix.
export const NAMESPACE_USERSETTINGS_PREFIX = `${USERSETTINGS_PREFIX}.namespace`;
export const NAMESPACE_LOCAL_STORAGE_KEY = 'dropdown-storage-namespaces';
export const APPLICATION_USERSETTINGS_PREFIX = `${USERSETTINGS_PREFIX}.applications`;
export const APPLICATION_LOCAL_STORAGE_KEY = 'dropdown-storage-applications';
export const LAST_NAMESPACE_NAME_USER_SETTINGS_KEY = `${USERSETTINGS_PREFIX}.lastNamespace`;
export const LAST_NAMESPACE_NAME_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/last-namespace-name`;
export const API_DISCOVERY_RESOURCES_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/api-discovery-resources`;
export const COMMUNITY_PROVIDERS_WARNING_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/community-providers-warning`;
export const COMMUNITY_PROVIDERS_WARNING_USERSETTINGS_KEY = `${USERSETTINGS_PREFIX}.communityProvidersWarning`;
export const PINNED_RESOURCES_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/pinned-resources`;
export const COLUMN_MANAGEMENT_LOCAL_STORAGE_KEY = `${STORAGE_PREFIX}/table-columns`;

// Bootstrap user for OpenShift 4.0 clusters (kube:admin) and CRC (kubeadmin)
export const KUBE_ADMIN_USERNAMES = ['kube:admin', 'kubeadmin'];

export const RH_OPERATOR_SUPPORT_POLICY_LINK =
  'https://access.redhat.com/third-party-software-support';

// Package manifests for the OperatorHub use this label.
export const OPERATOR_HUB_LABEL = 'openshift-marketplace';
export const CONFIG_STORAGE_CONSOLE = 'console';
export const COLUMN_MANAGEMENT_CONFIGMAP_KEY = `${CONFIG_STORAGE_CONSOLE}.tableColumns`;
export const ACM_LINK_ID = 'acm-console-link';
