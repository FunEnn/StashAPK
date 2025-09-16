import { fetchAPKData } from '@/lib/api';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type APKData = {
  name: string;
  icon: string;
  category: string;
  downloadUrl: string;
  description?: string;
  version?: string;
  size?: string;
  developer?: string;
  rating?: number;
  downloads?: string;
  lastUpdated?: string;
};

type SearchContextValue = {
  search: string;
  setSearch: (text: string) => void;
  searchQuery: string;
  searchResults: APKData[];
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<APKData[]>([]);
  const [allApks, setAllApks] = useState<APKData[]>([]);

  // 加载所有 APK 数据
  const loadAllApks = async () => {
    try {
      const data = await fetchAPKData();
      setAllApks(data);
    } catch (error) {
      console.error('加载APK数据失败:', error);
    }
  };

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setSearchQuery('');
        return;
      }

      setSearchQuery(query);

      try {
        // 如果还没有加载数据，先加载
        if (allApks.length === 0) {
          await loadAllApks();
        }

        // 基于已加载的数据进行搜索
        const filtered = allApks.filter(apk =>
          apk.name.toLowerCase().includes(query.toLowerCase())
        );

        setSearchResults(filtered);
      } catch (error) {
        console.error('搜索失败:', error);
        setSearchResults([]);
      }
    },
    [allApks]
  );

  const clearSearch = () => {
    setSearch('');
    setSearchQuery('');
    setSearchResults([]);
  };

  const value = useMemo(
    () => ({
      search,
      setSearch,
      searchQuery,
      searchResults,
      performSearch,
      clearSearch,
    }),
    [search, searchQuery, searchResults, performSearch]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchContext(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearchContext must be used within SearchProvider');
  return ctx;
}
