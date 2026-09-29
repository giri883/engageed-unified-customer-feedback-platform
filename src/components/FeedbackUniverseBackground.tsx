/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LiveNetworkBackground } from './LiveNetworkBackground';

export interface FeedbackUniverseBackgroundProps {
  children?: React.ReactNode;
}

export const FeedbackUniverseBackground: React.FC<FeedbackUniverseBackgroundProps> = ({ children }) => {
  return (
    <>
      <LiveNetworkBackground />
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        {children}
      </div>
    </>
  );
};
