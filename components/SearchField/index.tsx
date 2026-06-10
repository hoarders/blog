'use client';

import { Suspense, useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './index.module.css';

type ViewProps = { defaultQuery: string };

function SearchFieldView({ defaultQuery }: ViewProps) {
  const [composing, setComposition] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.code === 'Enter' && !composing) {
        location.href = `/search?q=${inputRef.current?.value}`;
      }
    },
    [composing],
  );
  return (
    <input
      type="search"
      name="q"
      ref={inputRef}
      className={styles.search}
      placeholder="Search..."
      onKeyDown={onKeyDown}
      onCompositionStart={() => setComposition(true)}
      onCompositionEnd={() => setComposition(false)}
      defaultValue={defaultQuery}
    />
  );
}

function SearchFieldWithQuery() {
  const q = useSearchParams().get('q') ?? '';
  return <SearchFieldView defaultQuery={q} />;
}

export default function SearchField() {
  return (
    <Suspense fallback={<SearchFieldView defaultQuery="" />}>
      <SearchFieldWithQuery />
    </Suspense>
  );
}
