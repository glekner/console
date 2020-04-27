import * as _ from 'lodash-es';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Page } from '@patternfly/react-core';
import CloudShell from '@console/app/src/components/cloud-shell/CloudShell';
import { ConsoleNotifier } from './console-notifier';
import { ConnectedNotificationDrawer } from './notification-drawer';
import AppContents from './app-contents';
import { getBrandingDetails, Masthead } from './masthead';
import { referenceForModel } from '../module/k8s';
import { Firehose } from './utils';
import { Navigation } from './nav';
import store from '../redux';
import useEventListener from './utils/useEventListener';
import { ClusterVersionModel } from '../models';
import * as UIActions from '../actions/ui';

export const App = ({ location, match }) => {
  const breakpointMD = 768;
  const NOTIFICATION_DRAWER_BREAKPOINT = 1800;

  const cvResource = [
    {
      kind: referenceForModel(ClusterVersionModel),
      namespaced: false,
      name: 'version',
      isList: false,
      prop: 'cv',
      optional: true,
    },
  ];
  const isDesktop = () => window.innerWidth >= breakpointMD;
  const isLargeLayout = () => window.innerWidth >= NOTIFICATION_DRAWER_BREAKPOINT;

  const [previousNavOpen, setPreviousNavOpen] = React.useState(isDesktop());
  const [isNavOpen, setIsNavOpen] = React.useState(isDesktop());

  const [previousDrawerInline, setPreviousDrawerInline] = React.useState(isLargeLayout());
  const [isDrawerInline, setIsDrawerInline] = React.useState(isLargeLayout());

  const usePrevious = (value) => {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevLocation = usePrevious({ location });
  const prevMatch = usePrevious({ match });

  React.useEffect(() => {
    const oldLocation = _.omit(prevLocation, ['key']);
    const newLocation = _.omit(location, ['key']);
    if (_.isEqual(newLocation, oldLocation) && _.isEqual(match, prevMatch)) {
      return;
    }
    // two way data binding :-/
    const { pathname } = location;
    store.dispatch(UIActions.setCurrentLocation(pathname));
  }, [location, match, prevLocation, prevMatch]);

  const onNavToggle = () => {
    // Some components, like svg charts, need to reflow when nav is toggled.
    // Fire event after a short delay to allow nav animation to complete.
    setTimeout(() => {
      window.dispatchEvent(new Event('sidebar_toggle'));
    }, 100);
    setIsNavOpen(!isNavOpen);
  };

  const onNotificationDrawerToggle = () => {
    if (isLargeLayout()) {
      // Fire event after the drawer animation speed delay.
      setTimeout(() => {
        window.dispatchEvent(new Event('sidebar_toggle'));
      }, 250);
    }
  };

  const onNavSelect = () => {
    //close nav on mobile nav selects
    if (!isDesktop()) {
      setIsNavOpen(false);
    }
  };

  const onResize = () => {
    const isCurrentDesktop = isDesktop();
    const isCurrentDrawerInline = isLargeLayout();
    if (previousNavOpen !== isCurrentDesktop) {
      setIsNavOpen(isCurrentDesktop);
      setPreviousNavOpen(isCurrentDesktop);
    }
    if (previousDrawerInline !== isCurrentDrawerInline) {
      setIsDrawerInline(isCurrentDrawerInline);
      setPreviousDrawerInline(isCurrentDrawerInline);
    }
  };

  useEventListener('resize', onResize);
  const { productName } = getBrandingDetails();

  return (
    <>
      <Helmet titleTemplate={`%s · ${productName}`} defaultTitle={productName} />
      <ConsoleNotifier location="BannerTop" />
      <Page
        header={<Masthead onNavToggle={onNavToggle} />}
        sidebar={
          <Navigation
            isNavOpen={isNavOpen}
            onNavSelect={onNavSelect}
            onPerspectiveSelected={onNavSelect}
          />
        }
      >
        <Firehose resources={cvResource}>
          <ConnectedNotificationDrawer
            isDesktop={isDrawerInline}
            onDrawerChange={onNotificationDrawerToggle}
          >
            <AppContents />
          </ConnectedNotificationDrawer>
        </Firehose>
      </Page>
      <CloudShell />
      <ConsoleNotifier location="BannerBottom" />
    </>
  );
};
