import React from 'react';
import { AccountPanel } from '@/components/account/account-panel';

export default function AccountPage(): React.JSX.Element {
  return (
    <div className="wrap" style={{paddingBottom:'4rem'}}>
      <AccountPanel />
    </div>
  );
}
