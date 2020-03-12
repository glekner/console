import * as React from 'react';

export const useCollisionChecker = <T>(
  entity: T,
  isEqual: (outdatedEntity: T, newEntity: T) => boolean,
): [boolean, () => void] => {
  const [initialEntity, setInitialEntity] = React.useState<T>(entity);
  const [showCollisionAlert, setCollisionAlert] = React.useState<boolean>(false);

  const onReload = React.useCallback(() => {
    setInitialEntity(entity);
    setCollisionAlert(false);
  }, [entity]);

  React.useEffect(() => {
    if (!isEqual(initialEntity, entity)) {
      setCollisionAlert(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  return [showCollisionAlert, onReload];
};
