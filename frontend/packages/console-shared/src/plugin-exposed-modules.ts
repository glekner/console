import '@console/internal/i18n.js';

import ActivityBody, {
  PauseButton,
  RecentEventsBodyContent,
} from './components/dashboard/activity-card/ActivityBody';
import ActivityItem, { ActivityProgress } from './components/dashboard/activity-card/ActivityItem';
import EventItem from './components/dashboard/activity-card/EventItem';
import Dashboard from './components/dashboard/Dashboard';
import DashboardCard from './components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from './components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from './components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardLink from './components/dashboard/dashboard-card/DashboardCardLink';
import DashboardCardTitle from './components/dashboard/dashboard-card/DashboardCardTitle';
import DashboardGrid from './components/dashboard/DashboardGrid';
import { DetailItem } from './components/dashboard/details-card/DetailItem';
import DetailsBody from './components/dashboard/details-card/DetailsBody';
import { Duration, useMetricDuration } from './components/dashboard/duration-hook';
import { InventoryItem } from './components/dashboard/inventory-card/InventoryItem';
import { InventoryStatusGroup } from './components/dashboard/inventory-card/status-group';
import HealthBody from './components/dashboard/status-card/HealthBody';
import HealthItem from './components/dashboard/status-card/HealthItem';
import { UtilizationBody } from './components/dashboard/utilization-card/UtilizationBody';
import YAMLEditor from './components/editor/YAMLEditor';
import GenericStatus from './components/status/GenericStatus';
import { ByteDataTypes } from './graph-helper/data-utils';
import {
  confirmAction,
  detailViewAction,
  getDetailActionDropdownOptions,
  listViewAction,
} from './test-utils/actions.view';
import { getReplicationControllersForResource } from './utils';
import { compareOwnerReference } from './utils/owner-references';

// export * from './types';
// export * from './utils';
// export * from './hooks';
// export * from './sorts';
// export * from './hoc';

export * from './test-utils/utils';
export * from './constants';
export * from './components';
export * from './k8s/patch';
export { PodRCData, OverviewItem } from './types';
export { useDebounceCallback, useDeepCompareMemoize } from './hooks';
export {
  getAnnotations,
  getAPIVersion,
  getName,
  getKind,
  getNamespace,
  getUID,
  getCreationTimestamp,
  getNodeName,
  getOwnerReferences,
  getLabel,
  getLabels,
  getDeletetionTimestamp,
  getNodeTaints,
  hasLabel,
} from './selectors';
export {
  asValidationObject,
  ValidationErrorType,
  ValidationObject,
  joinGrammaticallyListOfItems,
  createBasicLookup,
  dimensifyRow,
  getRandomChars,
  alignWithDNS1123,
  assureEndsWith,
  dimensifyHeader,
  createLookup,
  validateDNS1123SubdomainValue,
} from './utils';
export { useFlag, useActiveNamespace, usePrevious, useK8sModel } from './hooks';
export {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardLink,
  DashboardCardTitle,
  InventoryStatusGroup,
  ActivityProgress,
  ActivityItem,
  ActivityBody,
  PauseButton,
  RecentEventsBodyContent,
  DetailItem,
  DetailsBody,
  InventoryItem,
  UtilizationBody,
  ByteDataTypes,
  Duration,
  useMetricDuration,
  HealthBody,
  HealthItem,
  YAMLEditor,
  GenericStatus,
  Dashboard,
  DashboardGrid,
  EventItem,
  compareOwnerReference,
  detailViewAction,
  getDetailActionDropdownOptions,
  confirmAction,
  listViewAction,
  getReplicationControllersForResource,
};
