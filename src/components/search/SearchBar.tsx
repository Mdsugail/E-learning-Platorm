import React, { useState, useCallback } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { debounce } from '../../lib/utils';
import Input from '../ui/Input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  className
}) => {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = useCallback(
    debounce((value: string) => onSearch(value), 300),
    [onSearch]
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10"
        fullWidth
      />
    </div>
  );
};

export default SearchBar;