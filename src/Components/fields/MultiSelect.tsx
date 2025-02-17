import FieldWrapper from './components/FieldWrapper';
import MultiTextField from './components/MultiTextFieldInput';
import OptionsContainer from './components/OptionsContainer';
import { filterSelectedOptions, handleRemove } from './utils/functions';
import { useSelectData } from './utils/hooks';
import { JSX } from 'react';

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface SelectFieldProps {
  id?: string;
  name?: string;
  label?: string;
  values?: any;
  error?: any;
  showError?: boolean;
  editable?: boolean;
  options: SelectOption[] | string[];
  left?: JSX.Element;
  right?: JSX.Element;
  padding?: string;
  onChange: (option: any) => void;
  handleLogs?: (data: any) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  backgroundColor?: string;
  hasBorder?: boolean;
  getOptionLabel?: (option: any) => string;
  getOptionValue?: (option: any) => any;
  isSearchable?: boolean;
}

const MultiSelect = ({
  label,
  values = [],
  error,
  options = [],
  showError,
  onChange,
  disabled = false,
  className,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.id,
}: SelectFieldProps) => {
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange,
  } = useSelectData({
    options,
    disabled,
    onChange: (option) => onChange([...values, option]),
    getOptionLabel,
  });

  return (
    <FieldWrapper
      className={className}
      onClick={handleToggleSelect}
      showError={showError}
      label={label}
      error={error}
      handleBlur={handleBlur}
    >
      <MultiTextField
        values={values}
        input={input}
        error={error}
        placeholder={'Pasirinkite'}
        onRemove={({ index }) => {
          handleRemove(index, onChange, values);
        }}
        disabled={disabled}
        handleInputChange={handleOnChange}
        getOptionLabel={getOptionLabel}
      />
      <OptionsContainer
        values={filterSelectedOptions(suggestions, values, getOptionValue)}
        getOptionLabel={getOptionLabel}
        showSelect={showSelect}
        handleClick={handleClick}
      />
    </FieldWrapper>
  );
};

export default MultiSelect;
