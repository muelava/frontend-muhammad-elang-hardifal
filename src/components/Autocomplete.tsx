import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

interface AutoCompleteProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder: string;
  displayField: keyof T;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

function AutoComplete<T extends Record<string, any>>({
  options,
  value,
  onChange,
  placeholder,
  displayField,
  loading = false,
  disabled = false,
  className = "",
}: AutoCompleteProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const filtered = options.filter((option) =>
      String(option[displayField])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options, displayField]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  //   const handleClear = () => {
  //     onChange(null);
  //     setSearchTerm("");
  //   };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchTerm : value ? String(value[displayField]) : ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          disabled={disabled || loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              {loading ? "Loading..." : "No options found"}
            </div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 flex items-center justify-between"
              >
                <span>{String(option[displayField])}</span>
                {value && option[displayField] === value[displayField] && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AutoComplete;
