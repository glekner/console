/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

export const exposePluginAPI = () => {
  window.api = {
    useK8sWatchResource: require('@console/internal/components/utils/k8s-watch-hook')
      .useK8sWatchResource,
    useK8sWatchResources: require('@console/internal/components/utils/k8s-watch-hook')
      .useK8sWatchResources,
  };
};
