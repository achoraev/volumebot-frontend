"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { SolanaProvider } from '@/components/SolanaProvider';

export function ClientProviders({ children }: { children: ReactNode }) {
  return <SolanaProvider>{children}</SolanaProvider>;
}