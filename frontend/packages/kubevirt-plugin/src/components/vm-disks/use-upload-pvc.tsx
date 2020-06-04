import { useState, useEffect } from 'react';
import { getName } from '@console/shared';
import { k8sCreate } from '@console/internal/module/k8s';
import { FirehoseResult } from '@console/internal/components/utils';
import { getLoadedData } from '../../utils';
import { DataVolumeModel, UploadTokenRequestModel } from '../../models';
import { V1alpha1DataVolume } from '../../types/vm/disk/V1alpha1DataVolume';
import { V1alpha1DataVolumeStatus } from '../../types/vm/disk/V1alpha1DataVolumeStatus';

const getAvailableDVName = (dvs: V1alpha1DataVolume[]) => {
  const dvSet = new Set(dvs.map((dv) => getName(dv)));
  let index = 1;
  while (dvSet.has(`upload-datavolume-${index}`)) {
    index++;
  }
  return `upload-datavolume-${index}`;
};

export const useUploadPVC = (
  dvs: FirehoseResult<V1alpha1DataVolume[]>,
  namespace: string,
  storageClassName: string,
) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [dvName, setDVName] = useState('');
  const [createdDV, setCreatedDV] = useState(false);
  const [status, setStatus] = useState<V1alpha1DataVolumeStatus>({
    phase: 'Pending',
    progress: '0',
  });

  const init = async () => {
    const loadedDataVolumes = getLoadedData(dvs, []);
    const dataVolumeName = getAvailableDVName(loadedDataVolumes);
    setDVName(dataVolumeName);

    const dataVolume = {
      apiVersion: 'cdi.kubevirt.io/v1alpha1',
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
              storage: '1Gi',
            },
          },
        },
      },
    };

    await k8sCreate(DataVolumeModel, dataVolume)
      .then(() => setCreatedDV(true))
      .catch((err) => setError(err));
  };

  // update status
  useEffect(() => {
    if (createdDV) {
      const loadedDataVolumes = getLoadedData(dvs, []);
      const dv = loadedDataVolumes.find((datavolume) => getName(datavolume) === dvName);
      if (dv) {
        setStatus(dv?.status);
      }
    }
  }, [createdDV, dvName, dvs]);

  // create token
  useEffect(() => {
    if (status?.phase === 'UploadReady' && !token) {
      const tokenRequest = {
        apiVersion: 'upload.cdi.kubevirt.io/v1alpha1',
        kind: UploadTokenRequestModel.kind,
        metadata: {
          name: dvName,
          namespace,
        },
        spec: {
          pvcName: dvName,
        },
      };

      const createToken = async () => {
        await k8sCreate(UploadTokenRequestModel, tokenRequest)
          .then((res) => setToken(res?.status?.token))
          .catch((err) => setError(err));
      };

      createToken();
    }
  }, [dvName, namespace, status, token]);

  return { init, status, token, error };
};
