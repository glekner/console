/* eslint-disable camelcase, @typescript-eslint/camelcase,no-await-in-loop */
import { EnhancedK8sMethods } from '../../k8s/enhancedK8sMethods/enhancedK8sMethods';
import { DataVolumeModel, UploadTokenRequestModel } from '@console/kubevirt-plugin/src/models';
import { FirehoseResult } from '@console/internal/components/utils';
import { V1alpha1DataVolume } from '@console/kubevirt-plugin/src/types/vm/disk/V1alpha1DataVolume';
import { getLoadedData } from '@console/kubevirt-plugin/src/utils';
import { apiVersionForModel } from '@console/internal/module/k8s';
import { delay } from '../../utils/utils';
import { getAvailableDVName } from './helpers';

const PVC_STATUS_DELAY = 2 * 1000;

const waitForUploadReady = async (dvName, namespace, { k8sGet }, counter = 20) => {
  let dv;
  for (let i = 0; i < counter; i++) {
    if (dv?.status?.phase === 'UploadReady') {
      return true;
    }
    await delay(PVC_STATUS_DELAY);
    dv = await k8sGet(DataVolumeModel, dvName, namespace);
  }

  return false;
};

export const createUploadToken = async (
  dvs: FirehoseResult<V1alpha1DataVolume[]>,
  config: uploadConfig,
) => {
  const { k8sCreate, k8sGet } = new EnhancedK8sMethods();
  const { namespace, storageClassName, size } = config;
  const loadedDataVolumes = getLoadedData(dvs, []);
  const dataVolumeName = getAvailableDVName(loadedDataVolumes);
  let token = '';
  let error = '';

  const dataVolume = {
    apiVersion: apiVersionForModel(DataVolumeModel),
    kind: DataVolumeModel.kind,
    metadata: {
      name: dataVolumeName,
      namespace,
    },
    spec: {
      source: {
        upload: {},
      },
      pvc: {
        storageClassName,
        accessModes: ['ReadWriteOnce'],
        resources: {
          requests: {
            storage: size, // based on file size?
          },
        },
      },
    },
  };

  await k8sCreate(DataVolumeModel, dataVolume).catch((err) => (error = err));

  await waitForUploadReady(dataVolumeName, namespace, { k8sGet });

  const tokenRequest = {
    apiVersion: apiVersionForModel(UploadTokenRequestModel),
    kind: UploadTokenRequestModel.kind,
    metadata: {
      name: dataVolumeName,
      namespace,
    },
    spec: {
      pvcName: dataVolumeName,
    },
  };

  await k8sCreate(UploadTokenRequestModel, tokenRequest)
    .then((res) => (token = res?.status?.token))
    .catch((err) => (error = err));

  return { token, error };
};

type uploadConfig = {
  namespace: string;
  storageClassName: string;
  size: string;
};
