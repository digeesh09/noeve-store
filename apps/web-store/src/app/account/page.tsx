import React from 'react';
import { AccountPanel } from '@/components/account/account-panel';

export default function AccountPage(): React.JSX.Element {
  return (
    <div className="mx-auto max-w-container px-[var(--edge)] py-10 pb-20">
      <AccountPanel />
    </div>
  );
}
