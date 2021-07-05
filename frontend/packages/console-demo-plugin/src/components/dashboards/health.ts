import * as _ from 'lodash';
import { HealthState } from '@console/dynamic-plugin-sdk/src/shared/components/dashboard/status-card/states';
import { PrometheusHealthHandler, URLHealthHandler } from '@console/plugin-sdk';

export const getFooHealthState: URLHealthHandler<any> = () => ({ state: HealthState.OK });

export const getBarHealthState: PrometheusHealthHandler = (responses, t, nodes) => {
  if (!responses[0].response || !_.get(nodes, 'loaded')) {
    return {
      state: HealthState.LOADING,
    };
  }
  return {
    message: 'Additional message',
    state: HealthState.ERROR,
  };
};
