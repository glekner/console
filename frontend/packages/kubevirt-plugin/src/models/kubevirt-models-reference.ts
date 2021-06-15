import * as _ from 'lodash';
import { K8sKind } from '@console/internal/module/k8s/types';
import { modelFor, referenceForGroupVersionKind } from '@console/internal/module/k8s';

const VERSIONS = ['v1', 'v1alpha3', 'v1beta1', 'v1alpha1'];

export const getKubevirtModelAvailableVersion = (model: K8sKind): string =>
  _.uniq([model.apiVersion, ...VERSIONS]).find(
    (v) => !!modelFor(referenceForGroupVersionKind(model.apiGroup)(v)(model.kind)),
  ) || model.apiVersion;

export const kvReferenceForModel = (model: K8sKind): string => {
  const availableVersion = getKubevirtModelAvailableVersion(model);

  if (availableVersion) {
    return referenceForGroupVersionKind(model.apiGroup)(availableVersion)(model.kind);
  }

  return model.kind;
};

export const getKubevirtAvailableModel = (model: K8sKind): K8sKind => {
  const availableVersion = getKubevirtModelAvailableVersion(model);

  if (availableVersion) {
    return modelFor(referenceForGroupVersionKind(model.apiGroup)(availableVersion)(model.kind));
  }

  return model;
};
