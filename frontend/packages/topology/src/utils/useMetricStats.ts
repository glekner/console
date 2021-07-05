import * as React from 'react';
import * as _ from 'lodash';
import { usePodsWatcher } from '@console/dynamic-plugin-sdk/src/shared';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { MetricStats, getPodMetricStats } from './metricStats';
import { useOverviewMetrics } from './useOverviewMetrics';

export const useMetricStats = (resource: K8sResourceKind): MetricStats => {
  const metrics = useOverviewMetrics();
  const { podData, loaded } = usePodsWatcher(resource, resource.kind, resource.metadata.namespace);
  const memoryStats = React.useMemo(() => {
    if (_.isEmpty(metrics) || !loaded) {
      return null;
    }
    return getPodMetricStats(metrics, podData);
  }, [loaded, metrics, podData]);

  return memoryStats;
};
