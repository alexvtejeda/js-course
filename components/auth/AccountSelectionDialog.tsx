'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { loginToAccount } from '@/lib/auth/actions';
import { User, Plus } from 'lucide-react';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

interface Account {
  id: string;
  name: string;
}

interface AccountSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: Account[];
  onNewAccount: () => void;
}

export function AccountSelectionDialog({
  open,
  onOpenChange,
  accounts,
  onNewAccount,
}: AccountSelectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const router = useRouter();

  const handleAccountSelect = async (accountId: string) => {
    setIsLoading(true);
    setSelectedAccountId(accountId);

    try {
      const result = await loginToAccount(accountId);
      if (result?.error) {
        console.error('Login error:', result.error);
        setIsLoading(false);
        setSelectedAccountId(null);
      } else {
        // Success - the loading overlay will show during navigation
        router.refresh();
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setIsLoading(false);
      setSelectedAccountId(null);
    }
  };

  const handleNewAccount = () => {
    onOpenChange(false);
    onNewAccount();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {isLoading && <LoadingOverlay logoSrc="/logo-white.svg" />}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select an Account</DialogTitle>
            <DialogDescription>
              Choose which account you want to continue with
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {accounts.map((account) => (
              <Button
                key={account.id}
                variant="outline"
                className="w-full justify-start h-auto py-3 px-4"
                onClick={() => handleAccountSelect(account.id)}
                disabled={isLoading}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(account.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{account.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Continue learning
                  </span>
                </div>
                {isLoading && selectedAccountId === account.id && (
                  <span className="ml-auto text-sm text-muted-foreground">
                    Loading...
                  </span>
                )}
              </Button>
            ))}
          </div>

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleNewAccount}
              disabled={isLoading}
            >
              <div className="h-10 w-10 mr-3 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">Create New Account</span>
                <span className="text-xs text-muted-foreground">
                  Start a fresh learning journey
                </span>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
