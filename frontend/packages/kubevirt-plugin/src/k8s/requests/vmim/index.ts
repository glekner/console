import { k8sKill, K8sResourceKind } from '@console/internal/module/k8s';
import { getKubevirtAvailableModel } from '../../../models/kubevirt-models-reference';
import { VirtualMachineInstanceMigrationModel } from '../../../models';

export const cancelMigration = async (vmim: K8sResourceKind) =>
  k8sKill(getKubevirtAvailableModel(VirtualMachineInstanceMigrationModel), vmim);
